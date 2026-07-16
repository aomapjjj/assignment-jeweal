import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { InventoryQueryDto } from './dto/inventory-query.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InventoryEntity } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: InventoryQueryDto) {
    const { search, category, status, page = 1, limit = 20 } = query;

    const where: Prisma.ProductWhereInput = {
      ...(category && { category }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { sku: { contains: search, mode: 'insensitive' } },
          { productCode: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: items.map((p) => new InventoryEntity({ ...p, price: Number(p.price) })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException(`Product ${productId} not found`);
    return new InventoryEntity({ ...product, price: Number(product.price) });
  }

  /**
   * Manual stock adjustment. Uses an atomic conditional update
   * (`stock: { gte: -quantityChange }` guard) so two concurrent
   * adjustments can't push stock negative — the classic race condition
   * where two staff "correct" the same item at once.
   *
   * This intentionally does NOT touch `status`. Status transitions to
   * SOLD/CONSIGNED are business events driven by Sales/Order flows, not
   * by raw stock count — a manual restock of a SOLD item (e.g. a return)
   * should be a deliberate separate action, not an automatic side effect.
   */
  async adjustStock(productId: string, dto: UpdateStockDto) {
    const { quantityChange, reason } = dto;

    try {
      const updated = await this.prisma.product.update({
        where: {
          id: productId,
          // guard: only allow the decrement if it won't go below 0
          ...(quantityChange < 0 && { stock: { gte: -quantityChange } }),
        },
        data: {
          stock: { increment: quantityChange },
        },
      });

      // TODO(production): write a StockMovement/AuditLog row here
      // (productId, quantityChange, reason, actorUserId, timestamp).
      // Not in the current schema — flagged as a hidden requirement,
      // see notes. Without it, `reason` is accepted but not persisted
      // anywhere queryable, which defeats the point of requiring it.

      return new InventoryEntity({ ...updated, price: Number(updated.price) });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        // update matched 0 rows: either product doesn't exist, or the
        // stock guard failed (would have gone negative)
        const exists = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!exists) throw new NotFoundException(`Product ${productId} not found`);
        throw new ConflictException(
          `Cannot reduce stock by ${-quantityChange}: only ${exists.stock} available`,
        );
      }
      throw err;
    }
  }

  /**
   * Internal helper used by SalesService inside its own transaction.
   * Not exposed via the controller — sale-driven stock changes must
   * happen atomically with the Order/Sale/Payment writes, so this takes
   * a Prisma transaction client rather than opening its own.
   */
  static async decrementStockForSale(
    tx: Prisma.TransactionClient,
    productId: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException('Sale quantity must be greater than 0');
    }

    let updated;
    try {
      updated = await tx.product.update({
        where: {
          id: productId,
          status: InventoryStatus.AVAILABLE,
          stock: { gte: quantity },
        },
        data: {
          stock: { decrement: quantity },
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new ConflictException(
          `Product ${productId} is unavailable or has insufficient stock (already sold/reserved by another order)`,
        );
      }
      throw err;
    }

    // Jewelry items are typically unique (stock hits 0 = the piece is gone).
    // Once stock reaches 0 the item is SOLD; otherwise it stays AVAILABLE.
    if (updated.stock === 0) {
      updated = await tx.product.update({
        where: { id: productId },
        data: { status: InventoryStatus.SOLD },
      });
    }

    return updated;
  }
}
