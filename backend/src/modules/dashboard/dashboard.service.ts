import { Injectable } from '@nestjs/common';
import { InventoryStatus, OrderStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { DashboardQueryDto } from './{dto}/dashboard-query.dto';

const LOW_STOCK_DEFAULT_THRESHOLD = 2;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Headline numbers for the dashboard landing page. Defaults to "today"
   * when no range is given — an admin opening the dashboard wants to
   * know what's happening now, not an all-time total that never changes
   * meaningfully day to day.
   *
   * Revenue is computed from Payment rows (money actually received),
   * NOT from Order.totalAmount — a PENDING/PARTIAL order's total isn't
   * revenue yet, only what's been paid is.
   */
  async getSummary(query: DashboardQueryDto) {
    const { start, end } = this.resolveRange(query);

    const [
      revenueAgg,
      newOrdersCount,
      pendingOrdersCount,
      consignedCount,
      soldTodayCount,
      lowStockCount,
      totalCustomers,
    ] = await this.prisma.$transaction([
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paymentDate: { gte: start, lte: end } },
      }),
      this.prisma.order.count({
        where: { createdAt: { gte: start, lte: end } },
      }),
      this.prisma.order.count({
        where: { status: { in: [OrderStatus.PENDING, OrderStatus.PARTIAL] } },
      }),
      this.prisma.product.count({
        where: { status: InventoryStatus.CONSIGNED },
      }),
      this.prisma.sale.count({
        where: { soldAt: { gte: start, lte: end } },
      }),
      this.prisma.product.count({
        where: {
          status: InventoryStatus.AVAILABLE,
          stock: { lte: LOW_STOCK_DEFAULT_THRESHOLD, gt: 0 },
        },
      }),
      this.prisma.customer.count(),
    ]);

    return {
      range: { from: start, to: end },
      revenue: Number(revenueAgg._sum.amount ?? 0),
      newOrders: newOrdersCount,
      pendingOrders: pendingOrdersCount, // awaiting balance / not yet fully paid
      consignedItems: consignedCount, // out with a customer, not yet sold
      salesCompleted: soldTodayCount,
      lowStockAlerts: lowStockCount,
      totalCustomers,
    };
  }

  /**
   * Products at or below threshold — surfaced separately from the
   * summary count so the dashboard can list *which* items need
   * reordering, not just how many.
   */
  async getLowStockAlerts(threshold = LOW_STOCK_DEFAULT_THRESHOLD) {
    const products = await this.prisma.product.findMany({
      where: {
        status: InventoryStatus.AVAILABLE,
        stock: { lte: threshold, gt: 0 },
      },
      orderBy: { stock: 'asc' },
      select: {
        id: true,
        sku: true,
        name: true,
        category: true,
        stock: true,
      },
    });

    return products;
  }

  /**
   * Most recent completed sales — the "what just happened" feed for the
   * dashboard, distinct from pendingOrders (deposits still awaiting
   * balance) shown in the summary.
   */
  async getRecentSales(limit = 10) {
    const sales = await this.prisma.sale.findMany({
      take: limit,
      orderBy: { soldAt: 'desc' },
      include: {
        order: {
          include: {
            customer: { select: { id: true, fullName: true } },
            items: { include: { product: { select: { name: true, sku: true } } } },
          },
        },
      },
    });

    return sales.map((sale) => ({
      saleId: sale.id,
      orderId: sale.orderId,
      soldAt: sale.soldAt,
      customerName: sale.order.customer.fullName,
      totalAmount: Number(sale.order.totalAmount),
      items: sale.order.items.map((oi) => ({
        productName: oi.product.name,
        sku: oi.product.sku,
        quantity: oi.quantity,
      })),
    }));
  }

  private resolveRange(query: DashboardQueryDto) {
    if (query.from || query.to) {
      const start = query.from ? new Date(query.from) : this.startOfToday();
      const end = query.to ? new Date(query.to) : new Date();
      return { start, end };
    }
    return { start: this.startOfToday(), end: new Date() };
  }

  private startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
