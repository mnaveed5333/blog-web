import { NextResponse } from "next/server"
import { requireAdmin } from "@/controllers/adminController"
import { connectDB } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  await connectDB()
  const subscriptions = await Subscription.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
  return NextResponse.json({ subscriptions })
}