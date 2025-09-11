// src/features/store/viewStoreSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";

export const viewStoreDetail = createAsyncThunk(
  "store/viewStoreDetail",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/store/admin/detail/${storeId}`);
      if (response.data.code === "OK") {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "상점 정보 조회 실패");
      }
    } catch (error) {
      console.error("API Error Response:", error.response.data);
      return rejectWithValue(
        error.response.data.message || "상점 정보 조회 중 오류 발생"
      );
    }
  }
);

export const updateStoreDetail = createAsyncThunk(
  "store/updateStoreDetail",
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/store/admin/update`, storeData);
      if (response.data.code === "OK") {
        return response.data;
      } else {
        return rejectWithValue(
          response.data.message || "상점 정보 업데이트 실패"
        );
      }
    } catch (error) {
      console.error("API Error Response:", error.response.data);
      return rejectWithValue(
        error.response.data.message || "상점 정보 조회 중 오류 발생"
      );
    }
  }
);

const viewStoreSlice = createSlice({
  name: "viewStore",
  initialState: {
    loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
    updateLoading: "idle",
    storeData: null,
    error: null,
    message: "",
    storeId: null,
  },
  reducers: {
    resetViewStoreStatus: (state) => {
      state.loading = "idle";
      state.storeData = null;
      state.error = null;
      state.message = "";
      state.storeId = null;
    },
    updateHotdealStatus: (state, action) => {
      if (state.storeData) {
        state.storeData.hotdeal = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(viewStoreDetail.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(viewStoreDetail.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.storeData = action.payload.data;
        state.message = action.payload.message;
        state.storeId = action.payload.data.storeId;
      })
      .addCase(viewStoreDetail.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(updateStoreDetail.pending, (state) => {
        state.updateLoading = "pending";
        state.error = null;
      })
      .addCase(updateStoreDetail.fulfilled, (state, action) => {
        state.updateLoading = "succeeded";
        state.storeData = action.payload.data;
        state.message = action.payload.message;
        state.storeId = action.payload.data.storeId;
      })
      .addCase(updateStoreDetail.rejected, (state, action) => {
        state.updateLoading = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetViewStoreStatus, updateHotdealStatus } =
  viewStoreSlice.actions;

export default viewStoreSlice.reducer;
