import axiosInstance from "@/lib/axios";

import type {
  Customer,
  CustomerListResponse,
  CustomerQuery,
  CreateCustomerDto,
  UpdateCustomerDto,
} from "@/types/customer";

const CUSTOMER_ENDPOINT = "/customers";

export const customerService = {
  async getCustomers(
    params?: CustomerQuery
  ): Promise<CustomerListResponse> {
    const { data } = await axiosInstance.get<CustomerListResponse>(
      CUSTOMER_ENDPOINT,
      {
        params,
      }
    );

    return data;
  },

  async getCustomer(
    id: string
  ): Promise<Customer> {
    const { data } = await axiosInstance.get<Customer>(
      `${CUSTOMER_ENDPOINT}/${id}`
    );

    return data;
  },

  async createCustomer(
    payload: CreateCustomerDto
  ): Promise<Customer> {
    const { data } = await axiosInstance.post<Customer>(
      CUSTOMER_ENDPOINT,
      payload
    );

    return data;
  },

  async updateCustomer(
    id: string,
    payload: UpdateCustomerDto
  ): Promise<Customer> {
    const { data } = await axiosInstance.patch<Customer>(
      `${CUSTOMER_ENDPOINT}/${id}`,
      payload
    );

    return data;
  },

  async deleteCustomer(
    id: string
  ): Promise<void> {
    await axiosInstance.delete(
      `${CUSTOMER_ENDPOINT}/${id}`
    );
  },
};