import axiosInstance from "@/lib/axios";

import type {
  Product,
  ProductListResponse,
  ProductQuery,
} from "@/types/product";

const PRODUCT_ENDPOINT = "/products";

export const productService = {
  async getProducts(
    params?: ProductQuery
  ): Promise<ProductListResponse> {
    const { data } = await axiosInstance.get<ProductListResponse>(
      PRODUCT_ENDPOINT,
      {
        params,
      }
    );

    return data;
  },

  async getProduct(
    id: string
  ): Promise<Product> {
    const { data } = await axiosInstance.get<Product>(
      `${PRODUCT_ENDPOINT}/${id}`
    );

    return data;
  },

  async getSimilarProducts(
    id: string,
    take = 8
  ): Promise<Product[]> {
    const { data } = await axiosInstance.get<Product[]>(
      `${PRODUCT_ENDPOINT}/${id}/similar`,
      {
        params: {
          take,
        },
      }
    );

    return data;
  },
};