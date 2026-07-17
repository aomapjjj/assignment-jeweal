import { useQuery } from "@tanstack/react-query";

import { customerService } from "@/services/customer.service";

import type {
  CustomerQuery,
} from "@/types/customer";

export function useCustomers(
  params?: CustomerQuery
) {
  return useQuery({
    queryKey: ["customers", params],

    queryFn: () =>
      customerService.getCustomers(params),

    placeholderData: (previousData) => previousData,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],

    queryFn: () =>
      customerService.getCustomer(id),

    enabled: !!id,
  });
}