import { NextResponse } from "next/server"
import { requireAdmin } from "@/controllers/adminController"
import Blog from "@/models/Blog"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  // No admin check — public route
  await connectDB()
  const blogs = await Blog.find().sort({ createdAt: -1 })
  return NextResponse.json({ blogs })
}

export async function POST(req) {
  const { error } = await requireAdmin()
  if (error) return error
  await connectDB()
  const data = await req.json()
  const blog = await Blog.create(data)
  return NextResponse.json({ blog }, { status: 201 })
}