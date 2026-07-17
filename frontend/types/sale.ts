export enum PaymentMethod {
    CASH = "CASH",
    BANK_TRANSFER = "BANK_TRANSFER",
    QR_CODE = "QR_CODE",
}

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

export interface Product {
    id: string;
    sku: string;
    name: string;
    imageUrl?: string | null;
}

export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: Product;
}

export interface Payment {
    id: string;
    amount: number;
    paymentMethod: PaymentMethod;
    slipUrl?: string | null;
    note?: string | null;
    paymentDate: string;
    createdAt: string;
}

export interface Order {
    id: string;

    customerId: string;

    totalAmount: number;

    paidAmount: number;

    remainingAmount: number;

    status: OrderStatus;

    isConsignment: boolean;

    createdAt: string;

    customer: Customer;

    items: OrderItem[];

    payments: Payment[];
}

export interface Sale {
    id: string;

    orderId: string;

    soldAt: string;

    order: Order;
}