import bcrypt from "bcryptjs"
import User from "@/models/User"
import { signToken } from "@/lib/auth"
import { connectDB } from "@/lib/mongodb"

export async function registerUser({ name, email, password }) {
  await connectDB()

  const existing = await User.findOne({ email })
  if (existing) throw new Error("Email already in use")

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed })

  return { id: user._id, name: user.name, email: user.email, role: user.role }
}

export async function loginUser({ email, password }) {
  await connectDB()

  const user = await User.findOne({ email })
  if (!user) throw new Error("Invalid credentials")

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error("Invalid credentials")

  // email MUST be in token so middleware can check admin
  const token = signToken({ id: user._id, email: user.email, role: user.role })
  return { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }
}