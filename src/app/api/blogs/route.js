import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Blog from "@/models/Blog"

export async function GET(req) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const sort = searchParams.get("sort")
    const limit = parseInt(searchParams.get("limit")) || 0   // 0 = no limit in Mongoose

    const sortOption = sort === "views" ? { views: -1 } : { createdAt: -1 }

    const query = Blog.find().sort(sortOption)
    if (limit > 0) query.limit(limit)

    const blogs = await query
    return NextResponse.json({ blogs })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const blog = await Blog.create(body)
    return NextResponse.json({ blog })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
  }
}