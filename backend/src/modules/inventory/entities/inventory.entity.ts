import { InventoryStatus } from '@prisma/client';

/**
 * Response shape for inventory endpoints.
 * Mirrors the fields on Product that are relevant to stock/inventory
 * management, without leaking sales/pricing internals that don't belong
 * in an inventory view (e.g. we still show price since sales staff need it
 * at a glance, but we deliberately don't include order/payment data here).
 */
export class InventoryEntity {
  id: string;
  sku: string;
  productCode: string;
  name: string;
  category: string;
  productType: string;
  stock: number;
  status: InventoryStatus;
  price: number;
  updatedAt: Date;

  constructor(partial: Partial<InventoryEntity>) {
    Object.assign(this, partial);
  }
}
