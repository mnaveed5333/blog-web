import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

const ADMIN_EMAIL = "naveed5333425@gmail.com"

export function middleware(req) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.email !== ADMIN_EMAIL) {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    } catch {
      return NextResponse.redirect(new URL("/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}