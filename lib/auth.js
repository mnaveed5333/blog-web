import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export function getTokenFromRequest(req) {
  const auth = req.headers.get("authorization") || ""
  if (auth.startsWith("Bearer ")) return auth.slice(7)
  return null
}

export async function getAuthUser(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || ""
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/)
    const token = tokenMatch?.[1]

    if (!token) return { error: "Unauthorized" }

    const payload = verifyToken(token)
    if (!payload) return { error: "Invalid token" }

    return { user: { id: payload.id, email: payload.email, name: payload.name, role: payload.role } }
  } catch {
    return { error: "Unauthorized" }
  }
}