"use client"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import PlanCard from "@/components/subscription/PlanCard"
import SubscriptionStatus from "@/components/subscription/SubscriptionStatus"
import { useSubscription } from "@/hooks/useSubscription"

function PageContent() {
  const params = useSearchParams()
  const { fetchStatus } = useSubscription()
  const canceled = params.get("canceled")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchStatus()
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 pt-16 pb-24 px-4">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-500 opacity-10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-indigo-400 opacity-10 blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Pill badge */}
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            <svg className="w-3.5 h-3.5 text-amber-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            Premium Plans
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            Unlock All Premium Content
          </h1>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Get unlimited access to every blog, exclusive articles, and early releases — all for just $5/month.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-8">
            {[
              { icon: "M5 13l4 4L19 7", label: "Cancel anytime" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "Secure payment" },
              { icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: "Stripe powered" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-blue-200 text-sm">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon}/>
                </svg>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content — overlapping card */}
      <div className="relative max-w-4xl mx-auto px-4 -mt-8">

        {/* Canceled banner */}
        {canceled && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl font-medium shadow-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">Payment canceled</p>
              <p className="text-red-500 text-xs mt-0.5">You have not been charged. Choose a plan below to continue.</p>
            </div>
          </div>
        )}

        {/* Subscription status card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100 p-6 mb-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Your Subscription
          </h2>
          <SubscriptionStatus />
        </div>

        {/* Plan cards */}
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            Available Plans
          </h2>
          <div className="flex flex-col md:flex-row gap-5">
            <PlanCard
              name="Free"
              price="$0"
              features={["Access free blogs", "Limited content"]}
              isFree={true}
            />
            <PlanCard
              name="Premium"
              price="$5/mo"
              features={["All blogs", "Premium content", "Early access", "No ads"]}
              isFree={false}
            />
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-slate-400 text-xs pb-12">
          Payments are processed securely by Stripe. Your card details are never stored on our servers.
        </p>
      </div>
    </div>
  )
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50">
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 h-64" />
        <div className="max-w-4xl mx-auto px-4 -mt-8 space-y-6">
          <div className="h-32 bg-white rounded-2xl shadow-xl animate-pulse" />
          <div className="h-64 bg-white rounded-2xl shadow-xl animate-pulse" />
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  )
}