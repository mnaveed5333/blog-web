"use client"
import PlanCard from "../../components/subscription/PlanCard"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useBlogs } from "@/hooks/useBlogs"
import Image from "next/image"
import { useEffect } from "react"
import BlogCard from "@/components/blog/BlogCard"

function AuthPromptBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-8 text-center shadow-lg mt-10">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="relative">
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Unlock All Articles</h3>
        <p className="text-blue-100 text-sm max-w-sm mx-auto mb-6 font-light">
          Sign in or create a free account to browse all articles and premium content.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">Create free account</Link>
          <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">Sign in</Link>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const { mostViewed, fetchMostViewedBlogs } = useBlogs()

  useEffect(() => {
    if (user) fetchMostViewedBlogs()
  }, [user])

  return (
    <main className="bg-slate-100 min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden -mt-[60px]">
        <Image
          src="/OIP2.webp"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-6 pt-[calc(60px+7rem)] pb-28">
          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Premium Blogging Platform
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-6">
              Read Modern<span className="block text-blue-400">Premium Blogs</span>
            </h1>

            <p className="text-white text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
              Discover high-quality articles, premium insights, and exclusive content from professional writers around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
              <Link href="/register" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Get Started
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href={user ? "/blogs" : "/login"} className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-2xl font-semibold transition-all">
                {user ? "Browse Blogs" : "Sign in to Browse"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {[
                { bg: "bg-blue-100 text-blue-500", label: "500+", sub: "Premium Articles", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
                { bg: "bg-cyan-100 text-cyan-500", label: "10K+", sub: "Active Readers", icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
                { bg: "bg-amber-100 text-amber-500", label: "4.9★", sub: "Reader Rating", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
              ].map(({ bg, label, sub, icon }) => (
                <div key={sub} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mx-auto mb-3`}>{icon}</div>
                  <h3 className="text-2xl font-bold text-white">{label}</h3>
                  <p className="text-white text-sm mt-1">{sub}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Most Viewed Blogs Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-blue-500 font-semibold mb-2">Most Popular</p>
            <h2 className="text-4xl font-black text-slate-900">Most Viewed Blogs</h2>
          </div>
          {user && (
            <Link href="/blogs" className="hidden md:flex items-center gap-2 text-blue-500 hover:text-blue-600 font-semibold">
              View All
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : !user ? (
          <AuthPromptBanner />
        ) : mostViewed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mostViewed.map(blog => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-10">No blogs found</p>
        )}
      </section>

      {/* Pricing */}
      <section className="bg-white border-t border-slate-200 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-500 font-semibold mb-3">Pricing Plans</p>
            <h2 className="text-5xl font-black text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Start for free and upgrade anytime to unlock premium articles and exclusive member features.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PlanCard name="Free" price="$0" features={["Access free blogs", "Limited content", "Basic features"]} isFree={true} />
            <PlanCard name="Premium" price="$5/mo" features={["All free blogs", "Unlimited premium content", "Early access", "No ads"]} isFree={false} />
          </div>
          {!isLoading && !user && (
            <p className="text-center text-slate-400 text-sm mt-10">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-500 hover:underline font-medium">Sign in to access your plan</Link>
            </p>
          )}
        </div>
      </section>

    </main>
  )
}