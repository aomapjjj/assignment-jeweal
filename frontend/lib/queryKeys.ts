import { ProductQuery } from "@/types/product";

export const queryKeys = {
  products: (params?: ProductQuery) =>
    ["products", params] as const,

  product: (id: string) =>
    ["product", id] as const,

  similarProducts: (
    id: string,
    take = 8
  ) =>
    ["similar-products", id, take] as const,
};