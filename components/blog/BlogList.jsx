"use client"
import { useEffect } from "react"
import { useBlogs } from "@/hooks/useBlogs"
import BlogCard from "./BlogCard"
import Spinner from "@/components/ui/Spinner"
import { RiArticleLine } from "react-icons/ri"

export default function BlogList() {
  const { blogs, loading, error, fetchBlogs } = useBlogs()

  useEffect(() => { fetchBlogs() }, [])

  if (loading) return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-white font-semibold text-sm tracking-wide">All Blogs</h2>
        <p className="text-blue-200 text-xs mt-0.5">Loading articles...</p>
      </div>
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    </div>
  )

  if (error) return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-white font-semibold text-sm tracking-wide">All Blogs</h2>
      </div>
      <p className="text-red-400 text-center py-10 text-sm">{error}</p>
    </div>
  )

  if (!blogs.length) return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-white font-semibold text-sm tracking-wide">All Blogs</h2>
        <p className="text-blue-200 text-xs mt-0.5">0 articles</p>
      </div>
      <div className="text-center py-16">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
          <RiArticleLine size={18} className="text-blue-300" />
        </div>
        <p className="text-slate-400 text-sm">No blogs found</p>
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-white font-semibold text-sm tracking-wide">All Blogs</h2>
        <p className="text-blue-200 text-xs mt-0.5">{blogs.length} articles</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
      </div>
    </div>
  )
}