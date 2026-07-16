import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InventoryStatus, OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // Serializable isolation: if two sales staff try to order the last
    // unit of the same product at the same time, one transaction will
    // fail with a serialization error and must be retried by the client.
    return this.prisma.$transaction(
      async (tx) => {
        const customer = await tx.customer.findUnique({
          where: { id: dto.customerId },
        });
        if (!customer) {
          throw new NotFoundException('Customer not found');
        }

        const productIds = dto.items.map((i) => i.productId);
        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
        });

        if (products.length !== new Set(productIds).size) {
          throw new NotFoundException('One or more products not found');
        }

        let totalAmount = new Prisma.Decimal(0);
        const itemsData: {
          productId: string;
          quantity: number;
          price: Prisma.Decimal;
        }[] = [];

        for (const item of dto.items) {
          const product = products.find((p) => p.id === item.productId);

          if (!product) {
            throw new NotFoundException('Product not found');
          }

          // Jewelry pieces are (mostly) unique, but the schema supports
          // quantity > 1 for lots of the same SKU (e.g. plain bands).
          if (product.status !== InventoryStatus.AVAILABLE) {
            throw new ConflictException(
              `Product ${product.sku} is not available for sale (status: ${product.status})`,
            );
          }
          if (product.stock < item.quantity) {
            throw new ConflictException(
              `Insufficient stock for ${product.sku}: have ${product.stock}, requested ${item.quantity}`,
            );
          }

          // Price is always taken from the current product record, never
          // trusted from the client, to prevent price tampering.
          const lineTotal = product.price.mul(item.quantity);
          totalAmount = totalAmount.add(lineTotal);

          itemsData.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          });
        }

        const order = await tx.order.create({
          data: {
            customerId: dto.customerId,
            totalAmount,
            paidAmount: 0,
            remainingAmount: totalAmount,
            status: OrderStatus.PENDING,
            isConsignment: !!dto.isConsignment,
            items: {
              create: itemsData,
            },
          },
          include: { items: { include: { product: true } }, customer: true },
        });

        // Business rule: stock QUANTITY is never deducted on order/deposit.
        // It is only deducted once the order is fully paid (see
        // PaymentsService). However, if this order is a consignment,
        // the product must be flagged so no other sale can take the
        // same physical piece while it is out with this customer.
        if (dto.isConsignment) {
          await tx.product.updateMany({
            where: { id: { in: productIds } },
            data: { status: InventoryStatus.CONSIGNED },
          });
        }

        return order;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  findAll(params: { status?: OrderStatus; customerId?: string }) {
    return this.prisma.order.findMany({
      where: {
        status: params.status,
        customerId: params.customerId,
      },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
        payments: true,
        sale: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (dto.status === OrderStatus.CANCELLED) {
      return this.cancel(order.id);
    }

    // Directly setting PAID/PARTIAL from this endpoint is disallowed —
    // those transitions only happen inside PaymentsService, where the
    // paid/remaining amounts are recalculated atomically alongside them.
    if (
      dto.status &&
      (dto.status === OrderStatus.PAID || dto.status === OrderStatus.PARTIAL)
    ) {
      throw new BadRequestException(
        'Order status can only move to PAID/PARTIAL via a payment. Use POST /payments instead.',
      );
    }

    return order;
  }

  async cancel(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { items: true, sale: true },
      });
      if (!order) throw new NotFoundException('Order not found');

      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException('Order is already cancelled');
      }
      if (order.sale) {
        throw new BadRequestException(
          'Cannot cancel an order that has already been converted to a Sale. Process a return/refund instead.',
        );
      }
      if (order.paidAmount.greaterThan(0)) {
        throw new BadRequestException(
          'Order has payments recorded. Refund the customer before cancelling, or handle via a dedicated refund flow.',
        );
      }

      // Release any consignment hold back to AVAILABLE so the piece can
      // be sold to someone else.
      if (order.isConsignment) {
        await tx.product.updateMany({
          where: { id: { in: order.items.map((i) => i.productId) } },
          data: { status: InventoryStatus.AVAILABLE },
        });
      }

      return tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
      });
    });
  }
}
