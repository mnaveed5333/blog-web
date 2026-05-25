import { connectDB } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { getAuthUser } from "@/lib/auth"
import { verifyAndActivateSession } from "@/controllers/stripeController"

export async function getSubscriptionStatus(req) {
  const { user, error } = await getAuthUser(req)
  if (error) return { error }

  await connectDB()

  const subscription = await Subscription.findOne({ userId: user.id })

  if (!subscription || subscription.status !== "active") {
    return { isSubscribed: false, plan: null, expiryDate: null }
  }

  return {
    isSubscribed: true,
    plan: subscription.plan,
    expiryDate: subscription.currentPeriodEnd,
  }
}

export async function verifySession(req) {
  return verifyAndActivateSession(req)
}