"use client"
import { useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import { formatDate } from "@/lib/utils"
import { RiVipCrownLine } from "react-icons/ri"

export default function SubscriptionsTable() {
  const { subscriptions, fetchSubscriptions, loading } = useAdmin()

  useEffect(() => { fetchSubscriptions() }, [])

  return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="px-6 py-4 bg-blue-600">
        <h2 className="text-white font-semibold text-sm tracking-wide">Subscriptions</h2>
        <p className="text-blue-200 text-xs mt-0.5">{subscriptions.length} total subscriptions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-50 border-b border-blue-100">
              <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">User</th>
              <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Plan</th>
              <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Expires</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {subscriptions.map(sub => (
              <tr key={sub._id} className="hover:bg-blue-50/50">
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <RiVipCrownLine size={13} className="text-blue-500" />
                    </div>
                    <span className="text-slate-800 font-medium">{sub.userId?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-slate-500 text-xs">{sub.userId?.email}</td>
                <td className="px-6 py-3.5">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-700 capitalize">
                    <RiVipCrownLine size={11} /> {sub.plan}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-semibold ${
                    sub.status === "active"
                      ? "bg-slate-100 text-slate-600"
                      : "bg-red-100 text-red-500"
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-slate-500 text-xs">{formatDate(sub.endDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!subscriptions.length && !loading && (
        <div className="text-center py-12">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <RiVipCrownLine size={18} className="text-blue-300" />
          </div>
          <p className="text-slate-400 text-sm">No subscriptions found</p>
        </div>
      )}
      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">Loading subscriptions...</p>
        </div>
      )}
    </div>
  )
}