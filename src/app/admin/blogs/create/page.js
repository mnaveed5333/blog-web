"use client"
import BlogForm from "@/components/admin/BlogForm"

export default function CreateBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Create Blog</h1>
        <p className="text-slate-500 text-sm mt-1">Write and publish a new post</p>
      </div>
      <BlogForm mode="create" />
    </div>
  )
}