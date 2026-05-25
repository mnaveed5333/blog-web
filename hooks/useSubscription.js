import { useSelector, useDispatch } from "react-redux"
import { fetchSubscriptionStatus, createCheckout, setSubscribed } from "@/store/slices/subscriptionSlice"

export function useSubscription() {
  const dispatch = useDispatch()
  const { isSubscribed, plan, expiryDate, checkoutUrl, loading, error } = useSelector(
    (state) => state.subscription
  )

  async function subscribe() {
    const result = await dispatch(createCheckout()).unwrap()
    if (result?.url) window.location.href = result.url
  }

  // Called immediately on ?success=true — hits Stripe directly, no webhook wait
  async function verifyPayment(sessionId) {
    try {
      const res = await fetch(`/api/subscription/verify?session_id=${sessionId}`)
      const data = await res.json()
      if (data.isSubscribed) {
        dispatch(setSubscribed({ plan: data.plan, expiryDate: data.expiryDate }))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  return {
    isSubscribed,
    plan,
    expiryDate,
    checkoutUrl,
    loading,
    error,
    fetchStatus: () => dispatch(fetchSubscriptionStatus()),
    subscribe,
    verifyPayment,
  }
}