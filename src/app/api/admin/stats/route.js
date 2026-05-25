import { NextResponse } from "next/server"
import { requireAdmin } from "@/controllers/adminController"
import { connectDB } from "@/lib/mongodb"
import Blog from "@/models/Blog"
import User from "@/models/User"
import Subscription from "@/models/Subscription"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  await connectDB()

  const [totalUsers, totalBlogs, premiumBlogs, totalSubscribers, viewsAgg] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Blog.countDocuments({ isPremium: true }),
    Subscription.countDocuments({ status: "active" }),
    Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
  ])

  const totalViews = viewsAgg[0]?.total ?? 0

  return NextResponse.json({ totalUsers, totalBlogs, premiumBlogs, totalSubscribers, totalViews })
}