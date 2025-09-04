import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api";

/**
 * loginUser 비동기 Thunk
 * - 성공 시: 서버로부터 받은 데이터를 반환합니다.
 * - 실패 시: rejectWithValue를 사용하여 서버의 에러 응답을 반환합니다.
 */
export const loginUser = createAsyncThunk(
  "user/auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/auth/login", loginData);

      const responseData = response.data.data;
      console.log(responseData);

      if (typeof window !== "undefined" && responseData) {
        const { access, refresh } = responseData.accessRefreshToken;
        const expiresInSeconds = access.expiresIn;
        const expirationTime = Date.now() + expiresInSeconds * 1000 - 5000;
        localStorage.setItem("accessToken", access.token);
        localStorage.setItem("accessTokenExpiresIn", expirationTime);
        localStorage.setItem("refreshToken", refresh.token);
      }

      return responseData.userInfo;
    } catch (error) {
      console.error("로그인 실패 응답:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/auth/signup",
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/user/auth/signup", registerData);
      const responseData = response.data.data;
      return responseData;
    } catch (error) {
      console.error("회원가입 실패 응답:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isLoggedIn: false,
  userName: "",
  profileImage: "",
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessExpiresIn");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
        state.userInfo = null;
        state.error = action.payload;
      });
  },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
