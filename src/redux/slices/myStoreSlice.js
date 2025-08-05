// src/features/store/storeSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";

export const getStoreList = createAsyncThunk(
  "myStore/getStoreList",
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/store/admin/list");
      console.log(response.data.data);
      if (response.data.code === "OK") {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "상점 등록 실패");
      }
    } catch (error) {
      console.error("API Error Response:", error.response.data);
    }
  }
);

const myStoreSlice = createSlice({
  name: "myStore",
  initialState: {
    loading: "idle",
    storeList: [],
  },

  extraReducers: (builder) => {
    builder
      .addCase(getStoreList.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getStoreList.fulfilled, (state, action) => {
        state.loading = "succeeded";
        console.log(action.payload);
        state.storeList = action.payload;
      })
      .addCase(getStoreList.rejected, (state, action) => {
        state.loading = "failed";
        state.storeList = [];
      });
  },
});

export default myStoreSlice.reducer;
