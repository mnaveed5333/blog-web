"use client"
import { useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import SubscriptionsTable from "@/components/admin/SubscriptionsTable"

export default function SubscriptionsPage() {
  const { fetchSubscriptions } = useAdmin()
  useEffect(() => { fetchSubscriptions() }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Subscriptions</h1>
        <p className="text-slate-500 text-sm mt-1">View all active plans</p>
      </div>
      <SubscriptionsTable />
    </div>
  )
}