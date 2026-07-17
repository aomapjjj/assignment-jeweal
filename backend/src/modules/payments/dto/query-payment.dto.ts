import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class QueryPaymentDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;
}
