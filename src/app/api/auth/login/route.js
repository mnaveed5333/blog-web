import { NextResponse } from "next/server"
import { loginUser } from "@/controllers/authController"

export async function POST(req) {
  try {
    const body = await req.json()
    const data = await loginUser(body)
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 })
  }
}