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
      query: ({ storeId, page, size }) => ({
        url: `/order/stores/${storeId}/orders`,
        method: "GET",
        params: { page, size },
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        const { storeId } = queryArgs;
        return { storeId };
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
        method: "POST", // POST 또는 PATCH/PUT 등 서버 API에 맞는 메소드 사용
        data: { cancelReason },
      }),
      // 주문 취소 성공 시, 목록과 해당 상세 정보 캐시를 모두 무효화
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
} = orderApi;
