import { useQuery } from "@tanstack/react-query";

import { productService } from "@/services/product.service";

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],

    queryFn: () =>
      productService.getProduct(id),

    enabled: !!id,
  });
}

export function useSimilarProducts(
  id: string,
  take = 8
) {
  return useQuery({
    queryKey: ["similar-products", id, take],

    queryFn: () =>
      productService.getSimilarProducts(id, take),

    enabled: !!id,
  });
}