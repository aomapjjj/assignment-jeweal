import api from "@/lib/axios";

import type {
    AdjustStockDto,
    InventoryItem,
    InventoryResponse,
} from "@/types/inventory";

class InventoryService {
    async getAll() {
        const { data } =
            await api.get<InventoryResponse>("/inventory");

        return data;
    }

    async getById(id: string) {
        const { data } =
            await api.get<InventoryItem>(`/inventory/${id}`);

        return data;
    }

    async adjustStock(
        id: string,
        payload: AdjustStockDto
    ) {
        const { data } =
            await api.patch<InventoryItem>(
                `/inventory/${id}/stock`,
                payload
            );

        return data;
    }
}

export const inventoryService = new InventoryService();