import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchSubscriptionStatus = createAsyncThunk(
  "subscription/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/subscription/status")
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.error)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createCheckout = createAsyncThunk(
  "subscription/createCheckout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await res.json()
      if (!res.ok) return rejectWithValue(data.error)
      return data
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    isSubscribed: false,
    plan: "free",
    expiryDate: null,
    checkoutUrl: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Directly set subscription as active — called after verifyPayment succeeds
    setSubscribed: (state, action) => {
      state.isSubscribed = true
      state.plan = action.payload.plan ?? "premium"
      state.expiryDate = action.payload.expiryDate ?? null
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptionStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubscriptionStatus.fulfilled, (state, action) => {
        state.loading = false
        state.isSubscribed = action.payload.isSubscribed
        state.plan = action.payload.plan
        state.expiryDate = action.payload.expiryDate
      })
      .addCase(fetchSubscriptionStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCheckout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false
        state.checkoutUrl = action.payload.url
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSubscribed } = subscriptionSlice.actions
export default subscriptionSlice.reducer