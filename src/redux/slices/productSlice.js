import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, size, sort, storeId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/product/admin/list/${storeId}`, {
        params: { page, size, sort },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  products: [],
  pageable: {},
  totalPages: 0,
  totalElements: 0,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.content;
        state.pageable = action.payload.pageable;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
