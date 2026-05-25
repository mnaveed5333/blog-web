"use client"
import { useEffect } from "react"
import { useBlogs } from "@/hooks/useBlogs"
import BlogCard from "./BlogCard"
import Spinner from "@/components/ui/Spinner"

export default function BlogList() {
  const { blogs, loading, error, fetchBlogs } = useBlogs()

  useEffect(() => { fetchBlogs() }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>
  if (error) return <p className="text-red-400 text-center py-10">{error}</p>
  if (!blogs.length) return <p className="text-gray-400 text-center py-10">No blogs found</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
    </div>
  )
}