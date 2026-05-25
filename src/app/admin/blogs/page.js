"use client"
import { useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import BlogsTable from "@/components/admin/BlogsTable"
import Link from "next/link"
import { RiAddLine } from "react-icons/ri"

export default function AdminBlogsPage() {
  const { fetchAdminBlogs } = useAdmin()
  useEffect(() => { fetchAdminBlogs() }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Blogs</h1>
          <p className="text-slate-500 text-sm mt-1">Manage all blog posts</p>
        </div>
        <Link
          href="/admin/blogs/create"
          className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <RiAddLine size={16} /> New Blog
        </Link>
      </div>
      <BlogsTable />
    </div>
  )
}