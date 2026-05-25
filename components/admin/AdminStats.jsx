"use client"
import { useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import { RiGroupLine, RiArticleLine, RiLockLine, RiEyeLine } from "react-icons/ri"

export default function AdminStats() {
  const { stats, fetchStats, loading } = useAdmin()

  useEffect(() => { fetchStats() }, [])

  const cards = [
    { label: "Total Users",   value: stats.totalUsers,   icon: RiGroupLine,   },
    { label: "Total Blogs",   value: stats.totalBlogs,   icon: RiArticleLine, },
    { label: "Premium Blogs", value: stats.premiumBlogs, icon: RiLockLine,    },
    { label: "Total Views",   value: stats.totalViews,   icon: RiEyeLine,     },
  ]

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="h-28 bg-blue-50 rounded-2xl border border-blue-100" />
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <p className="text-white text-xs font-semibold tracking-wide">{label}</p>
            <Icon size={15} className="text-blue-200" />
          </div>
          <div className="px-4 py-4">
            <p className="text-2xl font-bold text-slate-800">
              {(value ?? 0).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}