import { stripe } from "@/lib/stripe"
import { connectDB } from "@/lib/mongodb"
import Subscription from "@/models/Subscription"
import { getAuthUser } from "@/lib/auth"

export async function createCheckoutSession(req) {
  const { user, error } = await getAuthUser(req)
  if (error) return { error }

  await connectDB()

  let subscription = await Subscription.findOne({ userId: user.id })
  let customerId = subscription?.stripeCustomerId

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    })
    customerId = customer.id
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe?canceled=true`,
    metadata: { userId: user.id },
  })

  return { url: session.url }
}

// Called on success redirect — verifies payment directly with Stripe, no webhook needed
export async function verifyAndActivateSession(req) {
  const { user, error } = await getAuthUser(req)
  if (error) return { error }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")
  if (!sessionId) return { error: "Missing session_id" }

  await connectDB()

  // Check if already activated (webhook may have already done it)
  const existing = await Subscription.findOne({ userId: user.id })
  if (existing?.status === "active") {
    return {
      isSubscribed: true,
      plan: existing.plan,
      expiryDate: existing.currentPeriodEnd,
      alreadyActive: true,
    }
  }

  // Verify directly with Stripe
  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    })
  } catch {
    return { error: "Invalid session" }
  }

  // Make sure this session belongs to the logged-in user
  if (session.metadata?.userId !== user.id) {
    return { error: "Session user mismatch" }
  }

  if (session.payment_status !== "paid") {
    return { error: "Payment not completed" }
  }

  const stripeSub = session.subscription
  if (!stripeSub) return { error: "No subscription found" }

  // Write to DB immediately — same as webhook would do
  const updated = await Subscription.findOneAndUpdate(
    { userId: user.id },
    {
      userId: user.id,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: stripeSub.id,
      plan: "premium",
      status: "active",
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
    },
    { upsert: true, new: true }
  )

  return {
    isSubscribed: true,
    plan: updated.plan,
    expiryDate: updated.currentPeriodEnd,
  }
}

export async function handleWebhook(req) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return { error: `Webhook error: ${err.message}` }
  }

  await connectDB()

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const userId = session.metadata.userId
    const stripeSubscriptionId = session.subscription
    const customerId = session.customer

    const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId)

    await Subscription.findOneAndUpdate(
      { userId },
      {
        userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId,
        plan: "premium",
        status: "active",
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      },
      { upsert: true, new: true }
    )
  }

  if (event.type === "customer.subscription.updated") {
    const stripeSub = event.data.object
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: stripeSub.id },
      {
        status: stripeSub.status === "active" ? "active" : "inactive",
        currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      }
    )
  }

  if (event.type === "customer.subscription.deleted") {
    const stripeSub = event.data.object
    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: stripeSub.id },
      { status: "canceled" }
    )
  }

  return { received: true }
}