export enum PaymentMethod {
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  QR_CODE = "QR_CODE"
}

export interface Payment {
  id: string

  orderId: string

  amount: number

  paymentMethod: PaymentMethod

  slipUrl?: string | null

  note?: string | null

  paymentDate: string

  createdAt: string
}

export interface CreatePaymentDto {
  orderId: string

  amount: number

  paymentMethod: PaymentMethod

  slipUrl?: string

  note?: string

  paymentDate?: string
}

export interface UploadSlipResponse {
  url: string

  filename: string

  originalName: string

  size: number

  mimeType: string
}
