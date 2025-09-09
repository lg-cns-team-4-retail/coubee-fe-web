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

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrdersByStore: builder.query({
      query: ({ storeId, page, size, keyword, status }) => {
        const params = { page, size };
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        console.log(params);
        return {
          url: `/order/stores/${storeId}/orders`,
          method: "GET",
          params,
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { storeId, keyword, status } = queryArgs;
        return { storeId, keyword, status };
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 0) {
          return newItems;
        }
        currentCache.content.push(...newItems.content);
        currentCache.last = newItems.last;
      },
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ orderId }) => ({
                type: "Order",
                id: orderId,
              })),
              { type: "Order", id: "LIST" },
            ]
          : [{ type: "Order", id: "LIST" }],
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    getOrderDetails: builder.query({
      query: ({ storeId, orderId }) => ({
        url: `/order/stores/${storeId}/orders/${orderId}`,
        method: "GET",
      }),
      transformResponse: (response) => response.data,
      providesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
      ],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/order/orders/${orderId}`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: "LIST" },
        { type: "Order", id: orderId },
      ],
    }),

    cancelOrder: builder.mutation({
      query: ({ orderId, cancelReason }) => ({
        url: `/order/orders/${orderId}/cancel`,
        method: "POST",
        data: { cancelReason },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: "LIST" },
        { type: "Order", id: orderId },
      ],
    }),
  }),
});

export const {
  useGetOrdersByStoreQuery,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useLazyGetOrderDetailsQuery,
} = orderApi;
