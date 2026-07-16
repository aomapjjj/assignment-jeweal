import type { Product } from "./product";

export enum OrderStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export interface Customer {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;

  productId: string;
  product: Product;
}

export interface Payment {
  id: string;
  amount: string;
  method: string;
  slipUrl?: string | null;
  createdAt: string;
}

export interface Sale {
  id: string;
  createdAt: string;
}

export interface Order {
  id: string;

  customerId: string;
  customer: Customer;

  totalAmount: string;
  paidAmount: string;
  remainingAmount: string;

  status: OrderStatus;

  isConsignment: boolean;

  items: OrderItem[];

  payments: Payment[];

  sale: Sale | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  customerId: string;

  items: {
    productId: string;
    quantity: number;
  }[];

  isConsignment?: boolean;
}

export interface OrderQuery {
  status?: OrderStatus;
  customerId?: string;
}