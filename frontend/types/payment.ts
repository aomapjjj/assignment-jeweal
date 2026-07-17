export enum PaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  QR_CODE = "QR_CODE",
}

export interface Payment {
  id: string;

  orderId: string;

  amount: number;

  paymentMethod: PaymentMethod;

  slipUrl?: string | null;

  note?: string | null;

  paymentDate: string;

  createdAt: string;
}

export interface CreatePaymentDto {
  orderId: string;

  amount: number;

  paymentMethod: PaymentMethod;

  slipUrl?: string;

  note?: string;

  paymentDate?: string;
}

export interface UploadSlipResponse {
  url: string;

  filename: string;

  originalName: string;

  size: number;

  mimeType: string;
}

export interface PaymentQuery {
  search?: string;

  paymentMethod?: PaymentMethod;

  page?: number;

  limit?: number;
}

export interface PaymentListResponse {
  data: Payment[];

  meta: {
    total: number;

    page: number;

    limit: number;

    totalPages: number;
  };
}