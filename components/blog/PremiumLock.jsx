"use client"
import Link from "next/link"
import { RiLockLine, RiArrowRightLine, RiStarFill } from "react-icons/ri"

export default function PremiumLock() {
  return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm mt-6">
      <div className="bg-blue-600 px-6 py-4 text-center">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
          <RiLockLine size={20} className="text-white" />
        </div>
        <h3 className="text-white font-semibold text-sm tracking-wide">Premium Content</h3>
        <p className="text-blue-200 text-xs mt-0.5">Subscribers only</p>
      </div>

      <div className="px-8 py-8 text-center bg-blue-50">
        <div className="flex items-center justify-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <RiStarFill key={i} size={14} className="text-amber-400" />
          ))}
        </div>
        <p className="text-slate-600 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
          Subscribe to unlock this and all other premium blog posts for just $5/month.
        </p>
        <Link
          href="/subscribe"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl"
        >
          Subscribe Now — $5/mo <RiArrowRightLine size={15} />
        </Link>
      </div>
    </div>
  )
}