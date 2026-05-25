import { NextResponse } from "next/server"
import { registerUser } from "@/controllers/authController"

export async function POST(req) {
  try {
    const body = await req.json()
    const user = await registerUser(body)
    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}