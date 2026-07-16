import {
  IsUUID,
  IsNumber,
  Min,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsUUID()
  orderId: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Payment amount must be greater than 0' })
  amount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  // Populated after calling POST /uploads/slip, or omitted for CASH.
  @IsOptional()
  @IsString()
  slipUrl?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;
}
