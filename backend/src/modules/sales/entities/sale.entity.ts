import { OrderStatus, PaymentMethod } from '@prisma/client';

export class SaleItemEntity {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
}

/**
 * A "Sale" in the direct-sale flow is really an Order + Payment + Sale
 * bundled together, all created in one atomic transaction. This entity
 * flattens that bundle into a single response shape for the frontend
 * rather than making it stitch three resources together.
 */
export class SaleEntity {
  saleId: string;
  orderId: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  items: SaleItemEntity[];
  soldAt: Date;

  constructor(partial: Partial<SaleEntity>) {
    Object.assign(this, partial);
  }
}
