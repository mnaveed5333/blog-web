export const dynamic = "force-dynamic"

import SubscriptionStatus from "@/components/subscription/SubscriptionStatus"
import BlogList from "@/components/blog/BlogList"

export default function UserDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">My Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your plan and read your blogs</p>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Your Plan</h2>
        <SubscriptionStatus />
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">Recent Blogs</h2>
        <BlogList />
      </section>
    </div>
  )
}