export enum InventoryStatus {
    AVAILABLE = "AVAILABLE",
    CONSIGNED = "CONSIGNED",
    SOLD = "SOLD",
}

export interface InventoryItem {
    id: string;

    sku: string;

    productCode: string;

    name: string;

    category: string;

    description?: string | null;

    price: number;

    stock: number;

    imageUrl?: string | null;

    status: InventoryStatus;

    createdAt: string;

    updatedAt: string;
}

export interface InventoryResponse {
    data: InventoryItem[];

    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AdjustStockDto {
    quantityChange: number;
    reason: string;
}