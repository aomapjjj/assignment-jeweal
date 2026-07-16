import { Payment, PaymentMethod } from '@prisma/client';

export class PaymentEntity implements Payment {
  id: string;
  orderId: string;
  amount: any; // Prisma Decimal
  paymentMethod: PaymentMethod;
  slipUrl: string | null;
  note: string | null;
  paymentDate: Date;
  createdAt: Date;
}
