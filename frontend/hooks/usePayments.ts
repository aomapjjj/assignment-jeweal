"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import api from "@/lib/axios"

import { CreatePaymentDto, Payment, PaymentListResponse, PaymentQuery } from "@/types/payment"

const PAYMENT_KEY = ["payments"]

export function usePayments(params?: PaymentQuery) {
  return useQuery<PaymentListResponse>({
    queryKey: ["payments", params],

    queryFn: async () => {
      const { data } = await api.get<PaymentListResponse>("/payments", {
        params
      })

      return data
    }
  })
}
export function usePayment(id: string) {
  return useQuery<Payment>({
    queryKey: [...PAYMENT_KEY, id],
    queryFn: async () => {
      const { data } = await api.get<Payment>(`/payments/${id}`)

      return data
    },
    enabled: !!id
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePaymentDto) => {
      const { data } = await api.post("/payments", payload)

      return data
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...PAYMENT_KEY, variables.orderId]
      })

      queryClient.invalidateQueries({
        queryKey: ["orders"]
      })

      queryClient.invalidateQueries({
        queryKey: ["order", variables.orderId]
      })

      queryClient.invalidateQueries({
        queryKey: ["sales"]
      })

      queryClient.invalidateQueries({
        queryKey: ["inventory"]
      })
    }
  })
}
export function useOrderPayments(
  orderId: string
) {
  return useQuery<Payment[]>({
    queryKey: ["payments", "order", orderId],

    queryFn: async () => {
      const { data } =
        await api.get<Payment[]>(
          `/payments/order/${orderId}`
        );

      return data;
    },

    enabled: !!orderId,
  });
}
