"use client"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

const ADMIN_EMAIL = "naveed5333425@gmail.com"

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" })
  const { loginUser, loading, error } = useAuth()
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    const res = await loginUser(form)
    if (!res?.error) {
      if (form.email === ADMIN_EMAIL) {
        router.push("/admin")
      } else {
        router.push("/blogs")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
      )}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-lg focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-lg focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-blue-100"
          placeholder="••••••••"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}