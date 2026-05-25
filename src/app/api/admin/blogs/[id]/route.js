import { NextResponse } from "next/server"
import { requireAdmin } from "@/controllers/adminController"
import Blog from "@/models/Blog"
import { connectDB } from "@/lib/mongodb"

export async function GET(_, { params }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    const { id } = await params
    await connectDB()
    const blog = await Blog.findById(id)
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ blog })
  } catch (err) {
    console.error("GET admin blog error:", err)
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
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