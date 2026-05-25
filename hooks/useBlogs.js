import { useSelector, useDispatch } from "react-redux"
import { fetchBlogs, fetchBlogById, clearCurrentBlog, fetchMostViewedBlogs } from "@/store/slices/blogSlice"

export function useBlogs() {
  const dispatch = useDispatch()
  const { blogs, currentBlog, mostViewed, loading, error } = useSelector((state) => state.blogs)

  return {
    blogs,
    currentBlog,
    mostViewed,                                                          // 👈 NEW
    loading,
    error,
    fetchBlogs: () => dispatch(fetchBlogs()),
    fetchBlogById: (id) => dispatch(fetchBlogById(id)).unwrap(),
    clearCurrentBlog: () => dispatch(clearCurrentBlog()),
    fetchMostViewedBlogs: () => dispatch(fetchMostViewedBlogs()),        // 👈 NEW
  }
}