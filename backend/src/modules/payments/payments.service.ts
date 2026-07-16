import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  OrderStatus,
  PaymentMethod,
  InventoryStatus,
  Prisma,
} from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    if (
      (dto.paymentMethod === PaymentMethod.BANK_TRANSFER ||
        dto.paymentMethod === PaymentMethod.QR_CODE) &&
      !dto.slipUrl
    ) {
      throw new BadRequestException(
        'slipUrl is required for BANK_TRANSFER and QR_CODE payments',
      );
    }

    // Serializable isolation protects against the classic "double payment"
    // race: two requests recording a payment for the same order at the
    // same instant, both reading the same stale remainingAmount. Whichever
    // transaction commits second will fail and must be retried by the
    // client with the now-current balance.
    return this.prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { id: dto.orderId },
          include: { items: true },
        });
        if (!order) throw new NotFoundException('Order not found');

        if (order.status === OrderStatus.CANCELLED) {
          throw new BadRequestException(
            'Cannot record a payment against a cancelled order',
          );
        }
        if (order.status === OrderStatus.PAID) {
          throw new BadRequestException('Order is already fully paid');
        }

        const amount = new Prisma.Decimal(dto.amount);

        if (amount.greaterThan(order.remainingAmount)) {
          throw new BadRequestException(
            `Payment amount (${amount.toFixed(2)}) exceeds remaining balance (${order.remainingAmount.toFixed(2)})`,
          );
        }

        const payment = await tx.payment.create({
          data: {
            orderId: order.id,
            amount,
            paymentMethod: dto.paymentMethod,
            slipUrl: dto.slipUrl,
            note: dto.note,
            paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : undefined,
          },
        });

        const newPaidAmount = order.paidAmount.add(amount);
        const newRemainingAmount = order.totalAmount.sub(newPaidAmount);
        const isFullyPaid = newRemainingAmount.lessThanOrEqualTo(0);

        const newStatus = isFullyPaid
          ? OrderStatus.PAID
          : newPaidAmount.greaterThan(0)
            ? OrderStatus.PARTIAL
            : OrderStatus.PENDING;

        const updatedOrder = await tx.order.update({
          where: { id: order.id },
          data: {
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount.lessThan(0)
              ? 0
              : newRemainingAmount,
            status: newStatus,
          },
        });

        // Business rule: stock is only deducted, and the Order converted
        // into a Sale, the moment the balance hits zero. A deposit or
        // partial payment must NEVER touch stock — see rationale below.
        if (isFullyPaid) {
          for (const item of order.items) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: { decrement: item.quantity },
                status: InventoryStatus.SOLD,
              },
            });
          }

          await tx.sale.create({
            data: { orderId: order.id },
          });
        }

        return { payment, order: updatedOrder };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  findAllForOrder(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { paymentDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }
}

/*
WHY stock is deducted on full payment, not on deposit:

1. A 50% deposit is a reservation of intent, not a completed sale. If the
   deal falls through (customer disappears, cancels, slip is fraudulent),
   the piece must go straight back on the shelf/catalog with zero
   inventory bookkeeping to reverse.
2. Jewelry pieces are frequently unique (1-of-1 rings, custom sizes).
   Deducting stock at deposit time on multiple simultaneous "reservations"
   for the same physical piece would understate available inventory and
   block a second, possibly more serious, buyer from even being offered it.
3. Accounting/audit correctness: "Sold" should mean revenue is fully
   recognized and the item has legally changed hands (or, for
   consignment, is out of the shop). Tying the Sale record + stock
   decrement to the same atomic transaction as the final payment keeps
   inventory and revenue reporting mutually consistent by construction.
4. Consignment is the deliberate escape hatch for "customer takes item
   before full payment" — it moves the item to a CONSIGNED state (still
   not SOLD, still not double-sellable) without pretending the sale is
   financially complete.
*/
