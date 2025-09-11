import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";

export const registerStore = createAsyncThunk(
  "store/registerStore",
  async (storeData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/store/admin/register", storeData);
      if (response.data.code === "OK") {
        return response.data;
      } else {
        return rejectWithValue(response.data.message || "상점 등록 실패");
      }
    } catch (error) {
      console.error("API Error Response:", error.response.data);
    }
  }
);

// 2. Slice 생성 (createSlice)
const storeSlice = createSlice({
  name: "store",
  initialState: {
    loading: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
    success: false,
    error: null,
    message: "",
    registeredStoreData: null,
  },
  reducers: {
    resetRegisterStatus: (state) => {
      state.loading = "idle";
      state.success = false;
      state.error = null;
      state.message = "";
      state.registeredStoreData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerStore.pending, (state) => {
        state.loading = "pending";
        state.success = false;
        state.error = null;
        state.message = "";
      })
      .addCase(registerStore.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.success = true;
        state.error = null;
        state.message = action.payload.message;
        state.registeredStoreData = action.payload.data;
      })
      .addCase(registerStore.rejected, (state, action) => {
        state.loading = "failed";
        state.success = false;
        state.error = action.payload || "알 수 없는 오류";
        state.message = action.payload || "상점 등록 실패";
      });
  },
});

// 액션 생성자 내보내기
export const { resetRegisterStatus } = storeSlice.actions;

// 리듀서 내보내기
export default storeSlice.reducer;
