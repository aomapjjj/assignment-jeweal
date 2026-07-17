"use client";

import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";

import { Sale } from "@/types/sale";

const SALES_KEY = ["sales"];

export function useSales() {
    return useQuery<Sale[]>({
        queryKey: SALES_KEY,
        queryFn: async () => {
            const { data } = await api.get<Sale[]>("/sales");
            return data;
        },
    });
}

export function useSale(id: string) {
    return useQuery<Sale>({
        queryKey: [...SALES_KEY, id],
        queryFn: async () => {
            const { data } = await api.get<Sale>(`/sales/${id}`);
            return data;
        },
        enabled: !!id,
    });
}