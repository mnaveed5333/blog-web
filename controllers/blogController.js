import { connectDB } from "@/lib/mongodb"
import Blog from "@/models/Blog"
import { getAuthUser } from "@/lib/auth"

export async function getAllBlogs() {
  await connectDB()
  const blogs = await Blog.find().sort({ createdAt: -1 })
  return { blogs }
}

export async function getBlogById(id) {
  await connectDB()
  const blog = await Blog.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  )
  if (!blog) return { error: "Blog not found" }
  return { blog }
}