export enum InventoryStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  CONSIGNED = "CONSIGNED",
  SOLD = "SOLD",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export enum ProductSortBy {
  PRICE = "price",
  NAME = "name",
  CREATED_AT = "createdAt",
  STOCK = "stock",
}

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export interface Product {
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

  price: string;

  stock: number;

  status: InventoryStatus;

  createdAt: string;

  updatedAt: string;
}

export interface ProductQuery {
  search?: string;

  category?: string;

  productType?: string;

  material?: string;

  status?: InventoryStatus;

  minPrice?: number;

  maxPrice?: number;

  sortBy?: ProductSortBy;

  sortOrder?: SortOrder;

  page?: number;

  limit?: number;
}

export interface PaginationMeta {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export interface ProductListResponse {
  data: Product[];

  meta: PaginationMeta;
}