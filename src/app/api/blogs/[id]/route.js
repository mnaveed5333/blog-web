import { NextResponse } from "next/server"
import { requireAdmin } from "@/controllers/adminController"
import Blog from "@/models/Blog"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"
import { getAuthUser } from "@/lib/auth"

export async function GET(req, { params }) {
  try {
    const { id } = await params
    await connectDB()
    const blog = await Blog.findById(id)
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { user } = await getAuthUser(req)
    console.log("👤 User:", user)

    if (user?.id) {
      await User.findByIdAndUpdate(user.id, { $pull: { readHistory: blog._id } })
      await User.findByIdAndUpdate(user.id, {
        $push: { readHistory: { $each: [blog._id], $position: 0, $slice: 50 } },
      })
      console.log("✅ History saved for:", user.id)
    } else {
      console.log("❌ No user — history skipped")
    }

    return NextResponse.json({ blog })
  } catch (err) {
    console.error("GET blog error:", err)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

// ✅ NEW — fixes 405 error from BlogContent view increment
export async function PATCH(req, { params }) {
  try {
    const { id } = await params
    await connectDB()
    const { incrementView } = await req.json()

    if (incrementView) {
      const blog = await Blog.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      )
      return NextResponse.json({ views: blog.views })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    const { id } = await params
    await connectDB()
    const data = await req.json()
    const blog = await Blog.findByIdAndUpdate(id, data, { new: true })
    return NextResponse.json({ blog })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    const { id } = await params
    await connectDB()
    await Blog.findByIdAndDelete(id)
    return NextResponse.json({ message: "Deleted" })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}