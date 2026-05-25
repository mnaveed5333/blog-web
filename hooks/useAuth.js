"use client"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { hydrateAuth, logout as logoutAction } from "@/store/slices/authSlice"

const ADMIN_EMAIL = "naveed5333425@gmail.com"

export function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const token = useSelector(state => state.auth.token)
  const authReady = useSelector(state => state.auth.authReady)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function registerUser(form) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return { error: data.error } }

      // ✅ Clear any previous user's payment state on new registration
      sessionStorage.removeItem("paymentPending")
      sessionStorage.removeItem("paymentPendingUserId")

      return data
    } catch {
      setError("Something went wrong")
      return { error: "Something went wrong" }
    } finally {
      setLoading(false)
    }
  }

  async function loginUser(form) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return { error: data.error } }

      // ✅ Clear previous user's payment state before setting new user
      sessionStorage.removeItem("paymentPending")
      sessionStorage.removeItem("paymentPendingUserId")

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

      dispatch(hydrateAuth({ user: data.user, token: data.token }))
      return data
    } catch {
      setError("Something went wrong")
      return { error: "Something went wrong" }
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    // ✅ Clear payment state on logout so next user starts clean
    sessionStorage.removeItem("paymentPending")
    sessionStorage.removeItem("paymentPendingUserId")
    document.cookie = "token=; path=/; max-age=0"
    dispatch(logoutAction())
    window.location.href = "/login"
  }

  return { user, token, authReady, registerUser, loginUser, logout, loading, error }
}