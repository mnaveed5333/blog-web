"use client"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchStats,
  fetchAdminBlogs,
  fetchAdminBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  fetchUsers,
  deleteUser,
  fetchSubscriptions,
} from "@/store/slices/adminSlice"

export function useAdmin() {
  const dispatch = useDispatch()
  const { stats, blogs, currentBlog, users, subscriptions, loading, error } = useSelector(s => s.admin)

  return {
    stats,
    blogs,
    currentBlog,
    users,
    subscriptions,
    loading,
    error,
    fetchStats: () => dispatch(fetchStats()),
    fetchAdminBlogs: () => dispatch(fetchAdminBlogs()),
    fetchAdminBlogById: (id) => dispatch(fetchAdminBlogById(id)),
    createBlog: (data) => dispatch(createBlog(data)),
    updateBlog: (id, data) => dispatch(updateBlog({ id, data })),
    deleteBlog: (id) => dispatch(deleteBlog(id)),
    fetchUsers: () => dispatch(fetchUsers()),
    deleteUser: (id) => dispatch(deleteUser(id)),
    fetchSubscriptions: () => dispatch(fetchSubscriptions()),
  }
}