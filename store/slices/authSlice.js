import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result
  }
)

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
    authReady: false,
    optimisticPremium: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.authReady = true
      state.optimisticPremium = false
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("paymentPending")
        sessionStorage.removeItem("paymentPendingUserId")
      }
    },
    hydrateAuth: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.authReady = true
    },
    setAuthReady: (state) => {
      state.authReady = true
    },
    setOptimisticPremium: (state, action) => {
      state.optimisticPremium = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false
        state.optimisticPremium = false
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("paymentPending")
          sessionStorage.removeItem("paymentPendingUserId")
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.authReady = true
        state.optimisticPremium = false
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("paymentPending")
          sessionStorage.removeItem("paymentPendingUserId")
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, hydrateAuth, setAuthReady, setOptimisticPremium } = authSlice.actions
export default authSlice.reducer