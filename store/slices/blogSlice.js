import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const fetchBlogs = createAsyncThunk("blogs/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/blogs")
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.blogs
  } catch (err) {
    return rejectWithValue("Failed to fetch blogs")
  }
})

export const fetchBlogById = createAsyncThunk("blogs/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/blogs/${id}`)
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.blog
  } catch (err) {
    return rejectWithValue("Failed to fetch blog")
  }
})

// 👇 NEW
export const fetchMostViewedBlogs = createAsyncThunk("blogs/fetchMostViewed", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/blogs?sort=views&limit=3")
    const result = await res.json()
    if (!res.ok) return rejectWithValue(result.error)
    return result.blogs
  } catch (err) {
    return rejectWithValue("Failed to fetch most viewed blogs")
  }
})

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: [],
    currentBlog: null,
    mostViewed: [],       // 👇 NEW
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false
        state.blogs = action.payload
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false
        state.currentBlog = action.payload
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // 👇 NEW
      .addCase(fetchMostViewedBlogs.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMostViewedBlogs.fulfilled, (state, action) => {
        state.loading = false
        state.mostViewed = action.payload
      })
      .addCase(fetchMostViewedBlogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentBlog } = blogSlice.actions
export default blogSlice.reducer