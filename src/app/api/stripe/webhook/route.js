import { NextResponse } from "next/server"
import { handleWebhook } from "@/controllers/stripeController"

export async function POST(req) {
  const result = await handleWebhook(req)
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
  return NextResponse.json(result)
}