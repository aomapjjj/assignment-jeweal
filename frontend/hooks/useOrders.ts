import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

import type {
  CreateOrderDto,
  Order,
  OrderQuery,
} from "@/types/order";

const ORDER_ENDPOINT = "/orders";

export function useOrders(params?: OrderQuery) {
  return useQuery({
    queryKey: ["orders", params],

    queryFn: async () => {
      const { data } = await axiosInstance.get<Order[]>(
        ORDER_ENDPOINT,
        {
          params,
        }
      );

      return data;
    },
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],

    queryFn: async () => {
      const { data } = await axiosInstance.get<Order>(
        `${ORDER_ENDPOINT}/${id}`
      );

      return data;
    },

    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateOrderDto) => {
      const { data } = await axiosInstance.post<Order>(
        ORDER_ENDPOINT,
        body
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.patch(
        `${ORDER_ENDPOINT}/${id}/cancel`
      );

      return data;
    },

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", id],
      });
    },
  });
}