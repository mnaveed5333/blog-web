import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchStats = createAsyncThunk("admin/stats", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/admin/stats")
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result
  } catch (err) {
    return rejectWithValue("Failed to fetch stats")
  }
})

export const fetchAdminBlogs = createAsyncThunk("admin/blogs", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/admin/blogs")
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.blogs
  } catch (err) {
    return rejectWithValue("Failed to fetch blogs")
  }
})

export const fetchAdminBlogById = createAsyncThunk("admin/blogById", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/admin/blogs/${id}`)
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.blog
  } catch (err) {
    return rejectWithValue("Failed to fetch blog")
  }
})

export const createBlog = createAsyncThunk("admin/createBlog", async (data, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.blog
  } catch (err) {
    return rejectWithValue("Failed to create blog")
  }
})

export const updateBlog = createAsyncThunk("admin/updateBlog", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.blog
  } catch (err) {
    return rejectWithValue("Failed to update blog")
  }
})

export const deleteBlog = createAsyncThunk("admin/deleteBlog", async (id, { rejectWithValue }) => {
  try {
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" })
    return id
  } catch (err) {
    return rejectWithValue("Failed to delete blog")
  }
})

export const fetchUsers = createAsyncThunk("admin/users", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/admin/users")
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.users
  } catch (err) {
    return rejectWithValue("Failed to fetch users")
  }
})

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, { rejectWithValue }) => {
  try {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    return id
  } catch (err) {
    return rejectWithValue("Failed to delete user")
  }
})

export const fetchSubscriptions = createAsyncThunk("admin/subscriptions", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/admin/subscriptions")
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.subscriptions
  } catch (err) {
    return rejectWithValue("Failed to fetch subscriptions")
  }
})

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: {},
    blogs: [],
    currentBlog: null,
    users: [],
    subscriptions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
      .addCase(fetchAdminBlogs.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.loading = false
        state.blogs = action.payload
      })
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchAdminBlogById.fulfilled, (state, action) => {
        state.currentBlog = action.payload
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.blogs.unshift(action.payload)
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        const index = state.blogs.findIndex(b => b._id === action.payload._id)
        if (index !== -1) state.blogs[index] = action.payload
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs = state.blogs.filter(b => b._id !== action.payload)
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload)
      })
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false
        state.subscriptions = action.payload
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default adminSlice.reducer