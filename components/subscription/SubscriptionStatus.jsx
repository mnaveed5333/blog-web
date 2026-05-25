"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { setOptimisticPremium } from "@/store/slices/authSlice"
import { useSubscription } from "@/hooks/useSubscription"
import { formatDate } from "@/lib/utils"

export default function SubscriptionStatus() {
  const { isSubscribed, expiryDate, fetchStatus, loading, verifyPayment } = useSubscription()
  const user = useSelector((state) => state.auth.user)
  const optimisticPremium = useSelector((state) => state.auth.optimisticPremium)
  const dispatch = useDispatch()

  const params = useSearchParams()
  const router = useRouter()
  const successParam = params.get("success")
  const sessionId = params.get("session_id")

  const [mounted, setMounted] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [handled, setHandled] = useState(false)

  const isPremium = isSubscribed || optimisticPremium
  const userId = user?.id || user?._id

  useEffect(() => {
    setMounted(true)
    fetchStatus()
  }, [])

  useEffect(() => {
    if (handled) return
    if (!userId) return

    if (successParam === "true" && sessionId) {
      dispatch(setOptimisticPremium(true))
      setShowBanner(true)
      setHandled(true)
      setVerifying(true)

      verifyPayment(sessionId).then((success) => {
        setVerifying(false)
        if (success) {
          dispatch(setOptimisticPremium(false))
          sessionStorage.removeItem("paymentPending")
          sessionStorage.removeItem("paymentPendingUserId")
        } else {
          sessionStorage.setItem("paymentPending", "true")
          sessionStorage.setItem("paymentPendingUserId", userId)
          const delays = [2000, 5000, 10000]
          delays.forEach((d) => setTimeout(() => fetchStatus(), d))
        }
        router.replace(window.location.pathname, { scroll: false })
      })
    } else if (
      sessionStorage.getItem("paymentPending") === "true" &&
      sessionStorage.getItem("paymentPendingUserId") === userId
    ) {
      dispatch(setOptimisticPremium(true))
      setShowBanner(true)
      setHandled(true)
      const delays = [1000, 3000, 6000, 10000]
      delays.forEach((d) => setTimeout(() => fetchStatus(), d))
    }
  }, [userId, successParam, sessionId])

  useEffect(() => {
    if (isSubscribed && optimisticPremium) {
      dispatch(setOptimisticPremium(false))
      sessionStorage.removeItem("paymentPending")
      sessionStorage.removeItem("paymentPendingUserId")
      const t = setTimeout(() => setShowBanner(false), 3000)
      return () => clearTimeout(t)
    }
  }, [isSubscribed])

  if (!mounted || (loading && !showBanner && !optimisticPremium)) {
    return (
      <div className="h-32 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-pulse" />
    )
  }

  return (
    <div className="space-y-4">

      {/* Success Banner */}
      {showBanner && (
        <div className="relative overflow-hidden flex items-center gap-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white px-6 py-4 shadow-lg shadow-emerald-200">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white opacity-10" />
          <div className="pointer-events-none absolute right-10 -bottom-4 w-16 h-16 rounded-full bg-white opacity-5" />

          <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center
            ${verifying ? "animate-pulse" : ""}`}
          >
            {verifying ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-40" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            )}
          </div>

          <div>
            <p className="font-bold text-sm leading-tight">
              {verifying ? "Verifying your payment…" : "Payment successful — Premium activated!"}
            </p>
            <p className="text-xs text-white/75 mt-0.5">
              {verifying
                ? "Confirming with Stripe, just a moment."
                : "Your account is now upgraded. Enjoy all premium content."}
            </p>
          </div>
        </div>
      )}

      {/* Status Card */}
      {isPremium ? (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-t-2xl" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon circle */}
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-200 flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-emerald-300 animate-ping opacity-20" />
              </div>

              <div>
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-widest mb-1">Current Plan</p>
                <p className="text-xl font-extrabold text-emerald-800 tracking-tight">Premium</p>
                {expiryDate && (
                  <p className="text-sm text-emerald-600 mt-0.5 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    Renews {formatDate(expiryDate)}
                  </p>
                )}
              </div>
            </div>

            <span className="flex-shrink-0 flex items-center gap-1.5 text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-full font-bold shadow-sm shadow-emerald-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              PRO
            </span>
          </div>

          {/* Feature pills */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["All blogs", "Premium content", "Early access", "No ads"].map((feature) => (
              <div key={feature} className="flex items-center gap-1.5 bg-white border border-emerald-100 text-emerald-700 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm">
                <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                {feature}
              </div>
            ))}
          </div>
        </div>

      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-t-2xl" />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-1">Current Plan</p>
                <p className="text-xl font-extrabold text-slate-700 tracking-tight">Free</p>
                <p className="text-sm text-slate-400 mt-0.5">Limited access to content</p>
              </div>
            </div>

            <span className="flex-shrink-0 text-xs bg-slate-100 border border-slate-200 text-slate-500 px-3 py-1.5 rounded-full font-bold">
              FREE
            </span>
          </div>

          {/* Upgrade prompt */}
          <div className="mt-5 relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="pointer-events-none absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white opacity-5" />
            <div>
              <p className="text-white font-bold text-sm">Unlock everything for just $5/month</p>
              <p className="text-blue-200 text-xs mt-0.5">All blogs · Premium content · Early access · No ads</p>
            </div>
            <Link
              href="/subscribe"
              className="flex-shrink-0 flex items-center gap-1.5 bg-white hover:bg-slate-50 text-blue-700 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              Upgrade
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
