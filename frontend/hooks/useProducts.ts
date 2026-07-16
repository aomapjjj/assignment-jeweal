import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/product.service";

import type { ProductQuery } from "@/types/product";

export function useProducts(
  params?: ProductQuery
) {
  return useQuery({
    queryKey: ["products", params],

    queryFn: () =>
      productService.getProducts(params),

    placeholderData: (previousData) => previousData,
  });
}

