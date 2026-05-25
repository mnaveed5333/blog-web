"use client"
import { useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import { RiGroupLine, RiArticleLine, RiStarLine, RiLockLine, RiEyeLine } from "react-icons/ri"

export default function AdminStats() {
  const { stats, fetchStats, loading } = useAdmin()

  useEffect(() => { fetchStats() }, [])

  const cards = [
    { label: "Total Users",    value: stats.totalUsers,       icon: RiGroupLine,   color: "text-blue-500",   bg: "bg-blue-50"   },
    { label: "Total Blogs",    value: stats.totalBlogs,       icon: RiArticleLine, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Subscribers",    value: stats.totalSubscribers, icon: RiStarLine,    color: "text-cyan-500",   bg: "bg-cyan-50"   },
    { label: "Premium Blogs",  value: stats.premiumBlogs,     icon: RiLockLine,    color: "text-amber-500",  bg: "bg-amber-50"  },
    { label: "Total Views",    value: stats.totalViews,       icon: RiEyeLine,     color: "text-emerald-500",bg: "bg-emerald-50"},
  ]

  if (loading) return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {[1,2,3,4,5].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
            <Icon size={20} className={color} />
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {(value ?? 0).toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  )
}