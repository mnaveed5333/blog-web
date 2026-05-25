"use client"
import Link from "next/link"

export default function PremiumLock() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-10 text-center mt-6">
      <div className="text-5xl mb-4">🔒</div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Premium Content</h3>
      <p className="text-slate-500 mb-6 max-w-sm mx-auto">
        Subscribe to unlock this and all other premium blog posts for just $5/month
      </p>
      <Link
        href="/subscribe"
        className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-3 rounded-lg inline-block transition-all"
      >
        Subscribe Now — $5/mo
      </Link>
    </div>
  )
}