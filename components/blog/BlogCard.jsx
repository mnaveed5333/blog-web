"use client"

import Link from "next/link"
import { useSelector } from "react-redux"
import { useSubscription } from "@/hooks/useSubscription"

export default function BlogCard({ blog }) {
  const { isSubscribed } = useSubscription()
  const optimisticPremium = useSelector(state => state.auth.optimisticPremium)

  const isPremium = isSubscribed || optimisticPremium
  const isLocked = blog.isPremium && !isPremium

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all group">

      <div className="relative overflow-hidden bg-slate-100" style={{ aspectRatio: "16/9" }}>
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            width={1280}
            height={720}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">📄</div>
        )}

        {isLocked && (
          <div className="absolute inset-0 bg-slate-900 bg-opacity-60 flex flex-col items-center justify-center gap-2">
            <span className="text-3xl">🔒</span>
            <span className="text-xs text-white font-medium bg-black bg-opacity-40 px-3 py-1 rounded-full">Premium only</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          {blog.isPremium ? (
            <span className="text-xs bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full font-bold shadow-sm">PREMIUM</span>
          ) : (
            <span className="text-xs bg-green-400 text-green-900 px-2.5 py-1 rounded-full font-bold shadow-sm">FREE</span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          {blog.category && (
            <span className="text-xs text-blue-500 font-medium">{blog.category}</span>
          )}
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">{blog.views} views</span>
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1.5 line-clamp-2 leading-snug">{blog.title}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">{blog.excerpt}</p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          {isLocked ? (
            <Link href="/subscribe" className="text-xs text-amber-600 hover:text-amber-700 font-semibold border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-lg transition-all">
              Unlock →
            </Link>
          ) : (
            <Link href={`/blog/${blog._id}`} className="text-xs text-blue-500 hover:text-blue-600 font-semibold border border-blue-100 bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
              Read more →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}