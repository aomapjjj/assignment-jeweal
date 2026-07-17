"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { inventoryService } from "@/services/inventory.service";

import type {
    AdjustStockDto,
    InventoryItem,
    InventoryResponse,
} from "@/types/inventory";

const INVENTORY_KEY = ["inventory"];

export function useInventory() {
    return useQuery<InventoryResponse>({
        queryKey: INVENTORY_KEY,
        queryFn: () => inventoryService.getAll(),
    });
}

export function useInventoryItem(id: string) {
    return useQuery<InventoryItem>({
        queryKey: [...INVENTORY_KEY, id],
        queryFn: () => inventoryService.getById(id),
        enabled: !!id,
    });
}

export function useAdjustStock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            quantityChange,
            reason,
        }: AdjustStockDto & { id: string }) =>
            inventoryService.adjustStock(id, {
                quantityChange,
                reason,
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: INVENTORY_KEY,
            });
        },
    });
}