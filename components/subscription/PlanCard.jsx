"use client"

import { useState } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { useSubscription } from "@/hooks/useSubscription"

export default function PlanCard({ name, price, features, isFree }) {
  const { subscribe, loading, isSubscribed } = useSubscription()
  const optimisticPremium = useSelector(state => state.auth.optimisticPremium)

  const isPremium = isSubscribed || optimisticPremium
  const isActivated = !isFree && isPremium

  return (
    <div className={`relative flex-1 rounded-2xl p-8 border transition-all duration-500 overflow-hidden group
      ${isFree
        ? "bg-white border-slate-200"
        : isActivated
          ? "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border-emerald-300 shadow-xl shadow-emerald-100"
          : "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-blue-500 shadow-xl shadow-blue-200"
      }`}
    >
      {/* Decorative orb — only on premium unactivated */}
      {!isFree && !isActivated && (
        <>
          <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white opacity-5" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-indigo-400 opacity-10" />
        </>
      )}

      {/* Activated shimmer ring */}
      {isActivated && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-emerald-300 opacity-60 animate-pulse" />
      )}

      {/* Header */}
      <div className="relative flex items-start justify-between mb-2">
        <div>
          {/* Plan badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3
            ${isFree
              ? "bg-slate-100 text-slate-500"
              : isActivated
                ? "bg-emerald-100 text-emerald-700"
                : "bg-white/15 text-white/80"
            }`}
          >
            {isFree ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12z"/></svg>
            ) : isActivated ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            )}
            {isFree ? "Free" : "Premium"}
          </span>

          <h3 className={`text-2xl font-extrabold tracking-tight
            ${isFree ? "text-slate-800" : isActivated ? "text-emerald-800" : "text-white"}`}
          >
            {name}
          </h3>
        </div>

        {isActivated && (
          <span className="flex items-center gap-1.5 text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-full font-bold shadow-sm">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            Active
          </span>
        )}
      </div>

      {/* Price */}
      <div className="relative mb-8">
        <div className="flex items-end gap-1">
          <span className={`text-5xl font-black tracking-tighter
            ${isFree ? "text-slate-700" : isActivated ? "text-emerald-700" : "text-white"}`}
          >
            {price.replace("/mo", "")}
          </span>
          {!isFree && (
            <span className={`text-sm font-medium pb-2 ${isActivated ? "text-emerald-500" : "text-white/60"}`}>
              /month
            </span>
          )}
        </div>
        {!isFree && !isActivated && (
          <p className="text-blue-200 text-xs mt-1">Billed monthly · Cancel anytime</p>
        )}
      </div>

      {/* Divider */}
      <div className={`h-px mb-6 ${isFree ? "bg-slate-100" : isActivated ? "bg-emerald-200" : "bg-white/15"}`} />

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
              ${isFree
                ? "bg-slate-100 text-slate-500"
                : isActivated
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-white/15 text-white"
              }`}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            </span>
            <span className={`text-sm font-medium
              ${isFree ? "text-slate-600" : isActivated ? "text-emerald-700" : "text-white/85"}`}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {isFree ? (
        <Link
          href="/blogs"
          className="flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:border-slate-300"
        >
          Get Started Free
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </Link>
      ) : isActivated ? (
        <div className="flex items-center justify-center gap-2 w-full bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-emerald-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
          Premium Activated
        </div>
      ) : (
        <button
          onClick={subscribe}
          disabled={loading}
          className="relative flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-50 disabled:bg-white/70 text-blue-700 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/25 hover:-translate-y-0.5 active:translate-y-0"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Redirecting to Stripe...
            </>
          ) : (
            <>
              Subscribe Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
            </>
          )}
        </button>
      )}
    </div>
  )
}
