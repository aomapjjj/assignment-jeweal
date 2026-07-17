import type { Order } from "./order";

export interface Customer {
  id: string;

  fullName: string;

  phoneNumber: string;

  email: string | null;

  orders?: Order[];

  createdAt: string;

  updatedAt: string;
}

export interface CustomerQuery {
  search?: string;

  page?: number;

  limit?: number;
}

export interface CustomerPaginationMeta {
  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export interface CustomerListResponse {
  data: Customer[];

  meta: CustomerPaginationMeta;
}

export interface CreateCustomerDto {
  fullName: string;

  phoneNumber: string;

  email?: string;
}

export interface UpdateCustomerDto {
  fullName?: string;

  phoneNumber?: string;

  email?: string;
}