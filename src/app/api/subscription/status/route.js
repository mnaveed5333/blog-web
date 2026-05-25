import { NextResponse } from "next/server"
import { getSubscriptionStatus } from "@/controllers/subscriptionController"

export async function GET(req) {
  const result = await getSubscriptionStatus(req)
  if (result.error) return NextResponse.json({ error: result.error }, { status: 401 })
  return NextResponse.json(result)
}