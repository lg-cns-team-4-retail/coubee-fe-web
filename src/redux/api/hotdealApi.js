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

export const hotdealApi = createApi({
  reducerPath: "hotdealApi",
  baseQuery: axiosBaseQuery({ baseUrl: "" }),
  tagTypes: ["Hotdeal"],
  endpoints: (builder) => ({
    activateHotdeal: builder.mutation({
      query: (hotdealData) => ({
        url: "/store/admin/hotdeal/on",
        method: "POST",
        data: hotdealData,
      }),
      invalidatesTags: ["Hotdeal"],
    }),
    deactivateHotdeal: builder.mutation({
      query: (storeId) => ({
        url: `/store/admin/hotdeal/off/${storeId}`,
        method: "POST",
      }),
      invalidatesTags: ["Hotdeal"],
    }),
  }),
});

export const { useActivateHotdealMutation, useDeactivateHotdealMutation } =
  hotdealApi;
