"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/axios";

import {
    CreatePaymentDto,
    Payment,
} from "@/types/payment";

const PAYMENT_KEY = ["payments"];

export function usePayments(orderId: string) {
    return useQuery<Payment[]>({
        queryKey: [...PAYMENT_KEY, orderId],
        queryFn: async () => {
            const { data } = await api.get<Payment[]>("/payments", {
                params: {
                    orderId,
                },
            });

            return data;
        },
        enabled: !!orderId,
    });
}

export function usePayment(id: string) {
    return useQuery<Payment>({
        queryKey: [...PAYMENT_KEY, id],
        queryFn: async () => {
            const { data } = await api.get<Payment>(
                `/payments/${id}`
            );

            return data;
        },
        enabled: !!id,
    });
}

export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            payload: CreatePaymentDto
        ) => {
            const { data } = await api.post(
                "/payments",
                payload
            );

            return data;
        },

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [...PAYMENT_KEY, variables.orderId],
            });

            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });

            queryClient.invalidateQueries({
                queryKey: ["order", variables.orderId],
            });

            queryClient.invalidateQueries({
                queryKey: ["sales"],
            });

            queryClient.invalidateQueries({
                queryKey: ["inventory"],
            });
        },
    });
}