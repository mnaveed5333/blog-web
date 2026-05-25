"use client"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import {
  RiHistoryLine, RiEyeLine, RiArrowRightLine,
  RiStarFill, RiCalendarLine, RiBookOpenLine, RiRefreshLine,
} from "react-icons/ri"

async function fetchHistoryFromAPI() {
  const r = await fetch("/api/user/history", { credentials: "include" })
  const d = await r.json()
  return d.history ?? []
}

export default function BlogHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const abortRef = useRef(null)

  // initial load
  useEffect(() => {
    setLoading(true)
    fetchHistoryFromAPI()
      .then(h => { setHistory(h); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleRefresh() {
    if (refreshing) return
    setRefreshing(true)
    fetchHistoryFromAPI()
      .then(h => { setHistory(h); setRefreshing(false) })
      .catch(() => setRefreshing(false))
  }

  if (loading) return (
    <div className="flex justify-center py-10">
      <div className="w-5 h-5 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
    </div>
  )

  if (!history.length) return (
    <div className="rounded-2xl border border-blue-100 bg-white shadow-sm p-10 text-center">
      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
        <RiBookOpenLine size={18} className="text-blue-300" />
      </div>
      <p className="text-slate-400 text-sm">No blogs read yet. Start reading!</p>
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
      >
        Browse Blogs <RiArrowRightLine size={12} />
      </Link>
    </div>
  )

  return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold text-sm tracking-wide flex items-center gap-2">
            <RiHistoryLine size={15} /> Reading History
          </h2>
          <p className="text-blue-200 text-xs mt-0.5">
            {history.length} blog{history.length !== 1 ? "s" : ""} read
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg disabled:opacity-50"
          >
            <RiRefreshLine size={13} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg"
          >
            Browse More <RiArrowRightLine size={13} />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-blue-50">
        {history.map((blog, i) => (
          <div key={blog._id} className="flex items-start gap-4 p-4 hover:bg-blue-50/40 transition-colors">
            <span className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-400 flex-shrink-0 mt-1">
              {i + 1}
            </span>

            {blog.coverImage ? (
              <img src={blog.coverImage} alt={blog.title}
                className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <RiBookOpenLine size={16} className="text-blue-200" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {blog.isPremium ? (
                  <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-semibold">
                    <RiStarFill size={9} /> Premium
                  </span>
                ) : (
                  <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
                    Free
                  </span>
                )}
                {blog.category && (
                  <span className="text-xs text-slate-400">{blog.category}</span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1">
                {blog.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <RiCalendarLine size={10} />
                  {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="flex items-center gap-1">
                  <RiEyeLine size={10} />
                  {blog.views?.toLocaleString()} views
                </span>
              </div>
            </div>

            <Link
              href={`/blog/${blog._id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex-shrink-0"
            >
              Read <RiArrowRightLine size={12} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}