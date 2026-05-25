"use client"
import { useSubscription } from "@/hooks/useSubscription"

export default function SubscribeButton() {
  const { subscribe, loading, isSubscribed } = useSubscription()

  if (isSubscribed) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-lg text-sm font-semibold text-center">
        ✓ You are subscribed
      </div>
    )
  }

  return (
    <button
      onClick={subscribe}
      disabled={loading}
      className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all"
    >
      {loading ? "Processing..." : "Subscribe — $5/month"}
    </button>
  )
}