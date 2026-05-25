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
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const avatarLetter = profile?.email?.charAt(0).toUpperCase() || "?"

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-4">
      <div className="max-w-lg mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          ← Back
        </button>

        {/* Avatar card */}
        <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm mb-5">
          <div className="bg-blue-600 px-6 py-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">
              {avatarLetter}
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg leading-tight">{profile?.name}</h1>
              <p className="text-blue-200 text-xs mt-0.5">{profile?.email}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                profile?.role === "admin"
                  ? "bg-white/20 text-white"
                  : "bg-blue-500 text-blue-100"
              }`}>
                {profile?.role}
              </span>
            </div>
          </div>

          {/* Account info row */}
          <div className="px-6 py-4 bg-blue-50 border-t border-blue-100 flex items-center justify-between text-xs">
            <div>
              <p className="text-blue-400 uppercase tracking-wide font-semibold mb-0.5">Member Since</p>
              <p className="text-slate-700 font-medium">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-blue-400 uppercase tracking-wide font-semibold mb-0.5">Role</p>
              <p className="text-slate-700 font-medium capitalize">{profile?.role}</p>
            </div>
          </div>
        </div>

        {/* Update form */}
        <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-white font-semibold text-sm tracking-wide">Update Profile</h2>
            <p className="text-blue-200 text-xs mt-0.5">Change your name, email or password</p>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <span>✓</span> Profile updated successfully
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-blue-50 border border-blue-100 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-blue-50 border border-blue-100 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1.5 flex items-center gap-2">
                  Password
                  {savedPassword
                    ? <span className="text-blue-400 text-xs font-normal normal-case">✓ Updated this session</span>
                    : <span className="text-blue-300 text-xs font-normal normal-case">(leave blank to keep current)</span>
                  }
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-blue-50 border border-blue-100 text-slate-800 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm pr-16"
                    placeholder={savedPassword ? "Password set ✓" : "Min 6 characters"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 text-xs font-semibold"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {showPassword && savedPassword && form.password && (
                  <p className="text-xs text-slate-400 mt-1.5">
                    Current password: <span className="font-mono text-slate-700 font-medium">{form.password}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm"
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
        </div>

      </div>
    </div>
  )
}