import { InventoryStatus, Product as PrismaProduct } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductEntity implements PrismaProduct {
  id: string;
  sku: string;
  productCode: string;
  name: string;
  description: string | null;
  category: string;
  productType: string;
  material: string;
  gemstone: string | null;
  weight: number | null;
  size: string | null;
  imageUrl: string | null;
  price: Decimal;
  stock: number;
  status: InventoryStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}
