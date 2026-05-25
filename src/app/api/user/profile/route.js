import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"
import Subscription from "@/models/Subscription"
import { verifyToken, getTokenFromRequest } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET(req) {
  try {
    const payload = verifyToken(getTokenFromRequest(req))
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const user = await User.findById(payload.id).select("-password").lean()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    // 👇 check real subscription status from Subscription model
    const subscription = await Subscription.findOne({
      userId: payload.id,
      status: "active"
    })

    // 👇 override isSubscribed with real value
    user.isSubscribed = !!subscription

    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const payload = verifyToken(getTokenFromRequest(req))
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    await connectDB()
    const { name, email, password } = await req.json()

    const updates = {}
    if (name) updates.name = name
    if (email) updates.email = email
    if (password) {
      if (password.length < 6)
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
      updates.password = await bcrypt.hash(password, 10)
    }

    const user = await User.findByIdAndUpdate(payload.id, updates, { new: true }).select("-password").lean()

    // 👇 check real subscription status here too
    const subscription = await Subscription.findOne({
      userId: payload.id,
      status: "active"
    })
    user.isSubscribed = !!subscription

    return NextResponse.json({ user })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}