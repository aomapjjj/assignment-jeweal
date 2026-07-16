import { IsOptional, IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

// NOTE: We intentionally do NOT allow editing items, totalAmount, paidAmount,
// or remainingAmount here. Those are derived/controlled exclusively by
// OrdersService (creation) and PaymentsService (on payment). Exposing them
// in an update DTO would let a client desync money math from reality.
export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus, {
    message: 'status must be one of PENDING, PARTIAL, PAID, CANCELLED',
  })
  status?: OrderStatus;
}
