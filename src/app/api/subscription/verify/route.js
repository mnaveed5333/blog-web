import { NextResponse } from "next/server"
import { verifySession } from "@/controllers/subscriptionController"

export async function GET(req) {
  const result = await verifySession(req)
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json(result)
}