"use client"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { useAdmin } from "@/hooks/useAdmin"
import BlogForm from "@/components/admin/BlogForm"

export default function EditBlogPage() {
  const { id } = useParams()
  const { fetchAdminBlogById, currentBlog, loading } = useAdmin()

  useEffect(() => { fetchAdminBlogById(id) }, [id])

  if (loading) return <p className="text-slate-400">Loading...</p>
  if (!currentBlog) return <p className="text-slate-400">Blog not found</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Edit Blog</h1>
        <p className="text-slate-500 text-sm mt-1">Update your post</p>
      </div>
      <BlogForm mode="edit" initialData={currentBlog} />
    </div>
  )
}