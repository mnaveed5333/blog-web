import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

const ADMIN_EMAIL = "naveed5333425@gmail.com"

export async function requireAdmin() {
  try {
    const cookieStore = await cookies()  // ← added await
    const token = cookieStore.get("token")?.value

    if (!token) {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return { error: NextResponse.json({ error: "Invalid token" }, { status: 401 }) }
    }

    if (decoded.email !== ADMIN_EMAIL) {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) }
    }

    return { decoded }
  } catch (err) {
    console.error("requireAdmin error:", err.message)
    return { error: NextResponse.json({ error: "Server error" }, { status: 500 }) }
  }
}