import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";
import * as api from "@/lib/auth/api";
import { setAuthToken } from "@/lib/axios/apiClient";

export type User = {
  id: number;
  email: string;
  role: string;
  org: {
    id: number;
    name: string;
    plan: string;
  };
};

type AuthState = {
  token?: string | null;
  user?: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
  status: "idle",
  error: null,
};

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (payload: api.SignupRequest, { rejectWithValue }) => {
    try {
      const resp = await api.signup(payload);
      return resp;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login", 
  async (payload: api.LoginRequest, { rejectWithValue }) => {
    try {
      const resp = await api.loginApi(payload);
      return resp;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const u = await api.me();
      return u;
    } catch (err: unknown) {
      return rejectWithValue(err);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) localStorage.setItem("token", action.payload);
        else localStorage.removeItem("token");
      }
      setAuthToken(action.payload ?? undefined);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
      setAuthToken(undefined);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        // Validate the response payload
        if (!action.payload || typeof action.payload !== 'object') {
          console.error("Invalid signup response payload:", action.payload);
          state.error = "Invalid server response format";
          return;
        }
        
        // Ensure user_id exists and is valid
        const userId = action.payload.user_id;
        if (userId === undefined || userId === null) {
          console.error("Signup response missing user_id:", action.payload);
          state.error = "Server did not provide user ID. Please try again or contact support.";
          return;
        }
        
        // Generate dummy token since backend may return null
        const token = action.payload.access_token || `user_authenticated_${userId}`;
        state.token = token;
        state.error = null;
        // Store both token and user_id
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId.toString());
        }
        setAuthToken(token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.status = "failed";
        // Build a safe error message from payload or error
        let message = "Signup failed";
        if (action.payload && typeof action.payload === "object") {
          try {
            message = JSON.stringify(action.payload);
          } catch {
            message = String(action.payload);
          }
        } else if (action.error && action.error.message) {
          message = String(action.error.message);
        }
        state.error = message;
      });
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload as User;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = "failed";
        state.user = null;
      });
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        
        // Validate the response payload
        if (!action.payload || typeof action.payload !== 'object') {
          console.error("Invalid login response payload:", action.payload);
          state.error = "Invalid server response format";
          return;
        }
        
        // Ensure user_id exists and is valid
        const userId = action.payload.user_id;
        if (userId === undefined || userId === null) {
          console.error("Login response missing user_id:", action.payload);
          state.error = "Server did not provide user ID. Please try again or contact support.";
          return;
        }
        
        // Generate dummy token since backend may return null
        const token = action.payload.access_token || `user_authenticated_${userId}`;
        state.token = token;
        state.error = null;
        // Store both token and user_id
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId.toString());
        }
        setAuthToken(token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        // Build a safe error message from payload or error
        let message = "Login failed";
        if (action.payload && typeof action.payload === "object") {
          try {
            message = JSON.stringify(action.payload);
          } catch {
            message = String(action.payload);
          }
        } else if (action.error && action.error.message) {
          message = String(action.error.message);
        }
        state.error = message;
      });
  },
});

export const { setToken, setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;
