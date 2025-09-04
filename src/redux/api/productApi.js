// src/redux/api/productApi.js (새로운 파일)

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiClient from "../../api";
// apiClient와 동일한 baseUrl과 헤더 설정을 가져옵니다.

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

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: axiosBaseQuery({
    baseUrl: "",
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ storeId, page, size, sort }) => ({
        url: `/product/admin/list/${storeId}`,
        method: "GET",
        params: { page, size, sort },
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
        currentCache.pageable = newItems.pageable;
      },
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.content.map(({ productId }) => ({
                type: "Product",
                id: productId,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "/product/admin/register",
        method: "POST",
        data: productData,
      }),

      invalidatesTags: [{ type: "Product", id: "LIST" }],
      transformResponse: (response) => response.data,
    }),

    updateProduct: builder.mutation({
      query: (productData) => ({
        url: "/product/admin/update",
        method: "POST",
        data: productData,
      }),
      async onQueryStarted(
        productData, // mutation에 전달된 인자 (수정할 상품 데이터)
        { dispatch, queryFulfilled, getState }
      ) {
        const storeId = productData.storeId;

        const patchResult = dispatch(
          productApi.util.updateQueryData(
            "getProducts",
            { storeId },
            (draft) => {
              const productIndex = draft.content.findIndex(
                (p) => p.productId === productData.productId
              );
              if (productIndex !== -1) {
                draft.content[productIndex] = productData;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} = productApi;
