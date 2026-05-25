"use client"
import { useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import AdminStats from "@/components/admin/AdminStats"
import BlogsTable from "@/components/admin/BlogsTable"

export default function AdminDashboard() {
  const { fetchAdminBlogs } = useAdmin()

  useEffect(() => { fetchAdminBlogs() }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your platform</p>
      </div>
      <AdminStats />
      <div>
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Recent Blogs</h2>
        <BlogsTable />
      </div>
    </div>
  )
}