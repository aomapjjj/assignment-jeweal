import { Order, OrderItem, OrderStatus } from '@prisma/client';

export class OrderEntity implements Order {
  id: string;
  customerId: string;
  totalAmount: any; // Prisma Decimal
  paidAmount: any;
  remainingAmount: any;
  status: OrderStatus;
  isConsignment: boolean;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}
