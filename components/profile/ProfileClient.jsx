"use client"
import { useState, useEffect } from "react"
import { useProfile } from "@/hooks/useProfile"
import { useRouter } from "next/navigation"

export default function ProfileClient() {
  const { profile, loading, saving, error, success, savedPassword, updateProfile } = useProfile()
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (profile) setForm({ name: profile.name, email: profile.email, password: "" })
  }, [profile])

  // Fill password field after successful update
  useEffect(() => {
    if (savedPassword) setForm(prev => ({ ...prev, password: savedPassword }))
  }, [savedPassword])

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { name: form.name, email: form.email }
    if (form.password) payload.password = form.password
    await updateProfile(payload)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const avatarLetter = profile?.email?.charAt(0).toUpperCase() || "?"

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-lg mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-slate-600 transition-all text-sm"
          >
            ← Back
          </button>
        </div>

        {/* Avatar card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-blue-500 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 shadow">
            {avatarLetter}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{profile?.name}</h1>
            <p className="text-slate-500 text-sm">{profile?.email}</p>
            <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-semibold ${
              profile?.role === "admin"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600"
            }`}>
              {profile?.role}
            </span>
          </div>
        </div>

        {/* Update form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Update Profile</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <span>✓</span> Profile updated successfully
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
                Password
                {savedPassword
                  ? <span className="text-green-600 text-xs font-normal">✓ Updated this session</span>
                  : <span className="text-slate-400 text-xs font-normal">(leave blank to keep current)</span>
                }
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all pr-16"
                  placeholder={savedPassword ? "Password set ✓" : "Min 6 characters"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {/* Show plain text hint only when revealed and password exists */}
              {showPassword && savedPassword && form.password && (
                <p className="text-xs text-slate-400 mt-1.5">
                  Current password: <span className="font-mono text-slate-700 font-medium">{form.password}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Account info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Account Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Member since</span>
              <span className="text-slate-800 font-medium">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subscription</span>
              <span className={`font-semibold ${profile?.isSubscribed ? "text-cyan-600" : "text-slate-400"}`}>
                {profile?.isSubscribed ? "PRO" : "Free"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Role</span>
              <span className="text-slate-800 font-medium capitalize">{profile?.role}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}