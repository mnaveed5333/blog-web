import { NextResponse } from "next/server"
import { createCheckoutSession } from "@/controllers/stripeController"

export async function POST(req) {
  const result = await createCheckoutSession(req)
  if (result.error) return NextResponse.json({ error: result.error }, { status: 401 })
  return NextResponse.json({ url: result.url })
}