import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Blog from "@/models/Blog"

export async function GET(_, { params }) {
  try {
    const { id } = await params
    await connectDB()

    // 👇 increment views on every open
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )

    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ blog })
  } catch (err) {
    console.error("GET blog error:", err)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params
    const body = await req.json()
    await connectDB()

    if (body.incrementView) {
      const blog = await Blog.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      )
      if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json({ views: blog.views })
    }

    return NextResponse.json({ error: "Invalid patch" }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params
    await connectDB()
    const body = await req.json()
    const blog = await Blog.findByIdAndUpdate(id, body, { new: true })
    return NextResponse.json({ blog })
  } catch (err) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  try {
    const { id } = await params
    await connectDB()
    await Blog.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}