import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/adminController"
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function DELETE(req, { params }) {
  const { error } = await requireAdmin(req)
  if (error) return error

  await connectDB()
  await User.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}