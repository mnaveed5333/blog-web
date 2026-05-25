"use client"
import PlanCard from "../../components/subscription/PlanCard"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useBlogs } from "@/hooks/useBlogs"
import Image from "next/image"
import { useEffect } from "react"
import BlogCard from "@/components/blog/BlogCard"
import { RiLockLine, RiArrowRightLine, RiStarLine, RiBookOpenLine, RiGroupLine, RiShieldLine } from "react-icons/ri"

function AuthPromptBanner() {
  return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="bg-blue-600 px-8 py-6 text-center">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
          <RiLockLine size={22} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">Unlock All Articles</h3>
        <p className="text-blue-200 text-xs mt-1 max-w-sm mx-auto">
          Sign in or create a free account to browse all articles and premium content.
        </p>
      </div>
      <div className="px-8 py-6 bg-blue-50 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
        >
          Create free account <RiArrowRightLine size={15} />
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 px-6 py-2.5 rounded-xl font-semibold text-sm"
        >
          Sign in
        </Link>
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
    <main className="bg-white min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden -mt-[60px]">
        <Image
          src="/hero.jpg"
          alt="Hero background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute" />

        <div className="relative max-w-7xl mx-auto px-6 pt-[calc(60px+2rem)] pb-28">
          <div className="max-w-3xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <RiStarLine size={13} className="text-white" />
              Premium Blogging Platform
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-5">
              Read Modern<span className="block text-gray-900">Premium Blogs</span>
            </h1>

            <p className="text-white text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Discover high-quality articles, premium insights, and exclusive content from professional writers around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              {!user && (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg"
                >
                  Get Started <RiArrowRightLine size={16} />
                </Link>
              )}
              <Link
                href={user ? "/blogs" : "/login"}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3.5 rounded-xl font-semibold text-sm"
              >
                {user ? "Browse Blogs" : "Sign in to Browse"}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { label: "500+",  sub: "Premium Articles", icon: RiBookOpenLine },
                { label: "10K+",  sub: "Active Readers",   icon: RiGroupLine    },
                { label: "4.9★",  sub: "Reader Rating",    icon: RiStarLine     },
              ].map(({ label, sub, icon: Icon }) => (
                <div key={sub} className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4 text-center">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/40 flex items-center justify-center mx-auto mb-2">
                    <Icon size={17} className="text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white">{label}</p>
                  <p className="text-blue-200 text-xs mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Most Viewed */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm mb-8">
          <div className="bg-blue-600 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-sm tracking-wide">Most Viewed Blogs</h2>
              <p className="text-blue-200 text-xs mt-0.5">Trending articles this week</p>
            </div>
            {user && (
              <Link
                href="/blogs"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-lg"
              >
                View All <RiArrowRightLine size={13} />
              </Link>
            )}
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="w-6 h-6 border-2 border-blue-100 border-t-blue-500 rounded-full animate-spin" />
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
              <div className="text-center py-12">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <RiBookOpenLine size={18} className="text-blue-300" />
                </div>
                <p className="text-slate-400 text-sm">No blogs found</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
            <div className="bg-blue-600 px-6 py-5 text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                <RiShieldLine size={12} /> Pricing Plans
              </div>
              <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
              <p className="text-blue-200 text-sm mt-1 max-w-md mx-auto">
                Start for free and upgrade anytime to unlock premium articles and exclusive features.
              </p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-5">
                <PlanCard
                  name="Free"
                  price="$0"
                  features={["Access free blogs", "Limited content", "Basic features"]}
                  isFree={true}
                />
                <PlanCard
                  name="Premium"
                  price="$5/mo"
                  features={["All free blogs", "Unlimited premium content", "Early access", "No ads"]}
                  isFree={false}
                />
              </div>
              {!isLoading && !user && (
                <p className="text-center text-slate-400 text-xs mt-6">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline font-medium">
                    Sign in to access your plan
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}