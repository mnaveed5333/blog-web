import { NextResponse } from "next/server"
import { requireAdmin } from "@/controllers/adminController"
import User from "@/models/User"
import { connectDB } from "@/lib/mongodb"

export async function DELETE(_, { params }) {
  const { error } = await requireAdmin()
  if (error) return error
  await connectDB()
  await User.findByIdAndDelete(params.id)
  return NextResponse.json({ message: "User deleted" })
}