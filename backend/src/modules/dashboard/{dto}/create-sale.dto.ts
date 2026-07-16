import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class SaleItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
  // Note: `price` is intentionally NOT accepted from the client.
  // The server always re-reads the current Product.price inside the
  // transaction — trusting a client-supplied price would let staff
  // (or a compromised frontend) sell a product for whatever number
  // they send. See validation notes below.
}

export class CreateSaleDto {
  @IsUUID()
  customerId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  items: SaleItemDto[];

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsString()
  slipUrl?: string; // required at the service layer when paymentMethod = BANK_TRANSFER / QR_CODE

  @IsOptional()
  @IsString()
  note?: string;
}
