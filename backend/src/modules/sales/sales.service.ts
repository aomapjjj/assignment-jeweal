import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, PaymentMethod, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { SaleEntity } from './entities/sale.entity';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Direct sale: customer pays in full right now, walks out with the item.
   * Unlike the deposit/order flow, there is no partial-payment window, so
   * stock is deducted immediately as part of this same transaction —
   * there's no "reserved but unpaid" state to model here.
   *
   * Everything below happens in ONE Prisma transaction: if stock deduction
   * fails for any item, the whole sale (order, items, payment, sale
   * record) rolls back. A "successful" sale with no matching stock
   * decrement (or vice versa) is exactly the kind of inventory/payment
   * mismatch this schema exists to prevent.
   */
  async createDirectSale(dto: CreateSaleDto, actorUserId: string) {
    const { customerId, items, paymentMethod, slipUrl, note } = dto;

    this.validateItems(items);
    this.validateSlip(paymentMethod, slipUrl);

    return this.prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({ where: { id: customerId } });
      if (!customer) throw new NotFoundException(`Customer ${customerId} not found`);

      // Fetch products fresh inside the transaction — never trust a
      // client-supplied price, and never assume stock/status from an
      // earlier catalog read is still true by the time this request lands.
      const productIds = items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });

      const productMap = new Map(products.map((p) => [p.id, p]));
      const missing = productIds.filter((id) => !productMap.has(id));
      if (missing.length) {
        throw new NotFoundException(`Product(s) not found: ${missing.join(', ')}`);
      }

      let totalAmount = new Prisma.Decimal(0);
      const orderItemsData = items.map((item) => {
        const product = productMap.get(item.productId)!;
        const lineTotal = product.price.mul(item.quantity);
        totalAmount = totalAmount.add(lineTotal);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price, // snapshot price at time of sale
        };
      });

      const order = await tx.order.create({
        data: {
          customerId,
          totalAmount,
          paidAmount: totalAmount,
          remainingAmount: new Prisma.Decimal(0),
          status: OrderStatus.PAID,
          isConsignment: false,
          items: { create: orderItemsData },
        },
        include: { items: { include: { product: true } } },
      });

      await tx.payment.create({
        data: {
          orderId: order.id,
          amount: totalAmount,
          paymentMethod,
          slipUrl,
          note,
        },
      });

      const sale = await tx.sale.create({ data: { orderId: order.id } });

      // Deduct stock per line item, atomically guarded against
      // over-selling (see InventoryService.decrementStockForSale).
      for (const item of items) {
        await InventoryService.decrementStockForSale(tx, item.productId, item.quantity);
      }

      // TODO(production): write an AuditLog row (actorUserId, action:
      // 'DIRECT_SALE', orderId, saleId) here for traceability of who
      // processed the sale.

      return new SaleEntity({
        saleId: sale.id,
        orderId: order.id,
        customerId,
        status: order.status,
        totalAmount: Number(totalAmount),
        paidAmount: Number(totalAmount),
        remainingAmount: 0,
        paymentMethod,
        soldAt: sale.soldAt,
        items: order.items.map((oi) => ({
          productId: oi.productId,
          productName: oi.product.name,
          sku: oi.product.sku,
          quantity: oi.quantity,
          price: Number(oi.price),
        })),
      });
    });
  }

  private validateItems(items: CreateSaleDto['items']) {
    const seen = new Set<string>();
    for (const item of items) {
      if (seen.has(item.productId)) {
        throw new BadRequestException(
          `Duplicate productId ${item.productId} in items — combine into a single line with the total quantity`,
        );
      }
      seen.add(item.productId);
    }
  }

  private validateSlip(method: PaymentMethod, slipUrl?: string) {
    if (method !== PaymentMethod.CASH && !slipUrl) {
      throw new BadRequestException(`slipUrl is required for payment method ${method}`);
    }
  }
}
