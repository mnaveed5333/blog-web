"use client"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { RiMailLine, RiLockLine, RiLoginBoxLine, RiBookOpenLine } from "react-icons/ri"

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
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm w-full max-w-md mx-auto">

      {/* Header */}
      <div className="bg-blue-600 px-8 py-6 text-center">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
          <RiBookOpenLine size={22} className="text-white" />
        </div>
        <h1 className="text-white font-bold text-lg tracking-wide">Welcome Back</h1>
        <p className="text-blue-200 text-xs mt-1">Sign in to continue to Readify</p>
      </div>

      {/* Form */}
      <div className="p-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <div className="relative">
              <RiMailLine size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-blue-50 border border-blue-100 text-slate-800 pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <RiLockLine size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-300" />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-blue-50 border border-blue-100 text-slate-800 pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
          >
            <RiLoginBoxLine size={16} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}