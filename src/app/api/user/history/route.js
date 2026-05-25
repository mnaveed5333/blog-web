import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import Blog from "@/models/Blog"
import User from "@/models/User"
import { getAuthUser } from "@/lib/auth"

export async function GET(req) {
  try {
    const { user, error } = await getAuthUser(req)
    console.log("📜 History — user:", user, "error:", error)

    if (error || !user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()

    const dbUser = await User.findById(user.id).select("readHistory")
    if (!dbUser?.readHistory?.length)
      return NextResponse.json({ history: [] }, {
        headers: { "Cache-Control": "no-store" }
      })

    const blogs = await Blog.find({ _id: { $in: dbUser.readHistory } })
      .select("title excerpt coverImage isPremium category views createdAt")
      .lean()

    const ordered = dbUser.readHistory
      .map(id => blogs.find(b => b._id.toString() === id.toString()))
      .filter(Boolean)

    return NextResponse.json({ history: ordered }, {
      headers: { "Cache-Control": "no-store" }
    })
  } catch (err) {
    console.error("History error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}