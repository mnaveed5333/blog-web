"use client"
import Link from "next/link"
import { useSelector } from "react-redux"
import { useSubscription } from "@/hooks/useSubscription"
import { RiEyeLine, RiLockLine, RiArrowRightLine, RiStarFill, RiCalendarLine } from "react-icons/ri"

export default function BlogCard({ blog }) {
  const { isSubscribed } = useSubscription()
  const optimisticPremium = useSelector(state => state.auth.optimisticPremium)

  const isPremium = isSubscribed || optimisticPremium
  const isLocked = blog.isPremium && !isPremium

  return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">

      {/* Cover */}
      <div className="relative overflow-hidden bg-blue-50" style={{ aspectRatio: "16/9" }}>
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            width={1280}
            height={720}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <RiEyeLine size={32} className="text-blue-200" />
          </div>
        )}

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-blue-900/60 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <RiLockLine size={20} className="text-white" />
            </div>
            <span className="text-xs text-white font-semibold bg-black/30 px-3 py-1 rounded-full">
              Premium only
            </span>
          </div>
        )}

        {/* Badge */}
        <div className="absolute top-3 left-3">
          {blog.isPremium ? (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">
              <RiStarFill size={10} /> Premium
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs bg-white/90 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full font-semibold">
              Free
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2.5">
          {blog.category && (
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              {blog.category}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <RiEyeLine size={11} /> {blog.views?.toLocaleString()} views
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-800 mb-1.5 line-clamp-2 leading-snug">
          {blog.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-blue-50">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <RiCalendarLine size={11} />
            {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          {isLocked ? (
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 border border-amber-200 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg"
            >
              Unlock <RiArrowRightLine size={12} />
            </Link>
          ) : (
            <Link
              href={`/blog/${blog._id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 border border-blue-100 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
            >
              Read more <RiArrowRightLine size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}