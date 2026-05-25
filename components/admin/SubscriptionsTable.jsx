"use client"
import { useAdmin } from "@/hooks/useAdmin"
import { formatDate } from "@/lib/utils"
import { RiVipCrownLine } from "react-icons/ri"

export default function SubscriptionsTable() {
  const { subscriptions, loading } = useAdmin()

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {["User", "Email", "Plan", "Status", "Expires"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub._id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-slate-800 font-medium">{sub.userId?.name}</td>
              <td className="px-4 py-3 text-slate-500">{sub.userId?.email}</td>
              <td className="px-4 py-3">
                <span className="flex items-center gap-1 text-[#06B6D4] font-medium capitalize">
                  <RiVipCrownLine size={13} /> {sub.plan}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  sub.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                }`}>
                  {sub.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500">{formatDate(sub.endDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!subscriptions.length && !loading && <p className="text-slate-400 text-center py-10 text-sm">No subscriptions found</p>}
      {loading && <p className="text-slate-400 text-center py-10 text-sm">Loading...</p>}
    </div>
  )
}