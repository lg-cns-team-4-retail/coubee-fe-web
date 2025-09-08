import { createApi } from "@reduxjs/toolkit/query/react";
import apiClient from "../../api";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, data, params }) => {
    try {
      const result = await apiClient({
        url: baseUrl + url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export const salesApi = createApi({
  reducerPath: "salesApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getDailySales: builder.query({
      query: ({ storeId, date }) => ({
        url: `/order/reports/admin/sales/daily`,
        method: "GET",
        params: { storeId, date },
      }),
      transformResponse: (response) => response.data,
    }),
    getWeeklySales: builder.query({
      query: ({ storeId, weekStartDate }) => ({
        url: `/order/reports/admin/sales/weekly`,
        method: "GET",
        params: { storeId, weekStartDate },
      }),
      transformResponse: (response) => response.data,
    }),
    getMonthlySales: builder.query({
      query: ({ storeId, year, month }) => ({
        url: `/order/reports/admin/sales/monthly`,
        method: "GET",
        params: { storeId, year, month },
      }),
      transformResponse: (response) => response.data,
    }),
    getProductSalesSummary: builder.query({
      query: ({ storeId, startDate, endDate }) => ({
        url: `/order/reports/admin/product-sales-summary`,
        method: "GET",
        params: { storeId, startDate, endDate },
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetDailySalesQuery,
  useGetWeeklySalesQuery,
  useGetMonthlySalesQuery,
  useGetProductSalesSummaryQuery,
} = salesApi;
