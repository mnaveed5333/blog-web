import { NextResponse } from "next/server"
import { requireAdmin } from "@/controllers/adminController"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"

export async function GET() {
  const { error } = await requireAdmin()
  if (error) return error
  await connectDB()
  const users = await User.find().select("-password").sort({ createdAt: -1 })
  return NextResponse.json({ users })
}