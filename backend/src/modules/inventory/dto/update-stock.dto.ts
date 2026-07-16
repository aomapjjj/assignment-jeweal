import { IsInt, IsNotEmpty, IsString, NotEquals } from 'class-validator';

/**
 * Manual stock adjustment — e.g. restock, damage write-off, stock-take
 * correction. This is NOT how stock is decremented for a sale (that path
 * goes through SalesService inside a DB transaction so it stays atomic
 * with order/payment creation). This endpoint is for admin corrections
 * only, which is why `reason` is mandatory — every manual change should
 * be explainable/auditable.
 */
export class UpdateStockDto {
  @IsInt()
  @NotEquals(0, { message: 'quantityChange must not be 0' })
  quantityChange: number; // positive = add stock, negative = remove stock

  @IsString()
  @IsNotEmpty()
  reason: string; // e.g. "Stock take correction", "Damaged item", "New batch received"
}
