"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { setOptimisticPremium } from "@/store/slices/authSlice"
import { useSubscription } from "@/hooks/useSubscription"
import { formatDate } from "@/lib/utils"

const FEATURES = ["All blogs", "Premium content", "Early access", "No ads"]

export default function SubscriptionStatus() {
  const { isSubscribed, expiryDate, fetchStatus, loading, verifyPayment } = useSubscription()
  const user = useSelector((s) => s.auth.user)
  const optimisticPremium = useSelector((s) => s.auth.optimisticPremium)
  const dispatch = useDispatch()

  const params = useSearchParams()
  const router = useRouter()
  const successParam = params.get("success")
  const sessionId = params.get("session_id")

  const [mounted, setMounted] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [handled, setHandled] = useState(false)

  const isPremium = isSubscribed || optimisticPremium
  const userId = user?.id || user?._id

  useEffect(() => {
    setMounted(true)
    fetchStatus()
  }, [])

  useEffect(() => {
    if (handled || !userId) return
    if (successParam === "true" && sessionId) {
      dispatch(setOptimisticPremium(true))
      setShowBanner(true)
      setHandled(true)
      setVerifying(true)
      verifyPayment(sessionId).then((success) => {
        setVerifying(false)
        if (success) {
          dispatch(setOptimisticPremium(false))
          sessionStorage.removeItem("paymentPending")
          sessionStorage.removeItem("paymentPendingUserId")
        } else {
          sessionStorage.setItem("paymentPending", "true")
          sessionStorage.setItem("paymentPendingUserId", userId)
          ;[2000, 5000, 10000].forEach((d) => setTimeout(() => fetchStatus(), d))
        }
        router.replace(window.location.pathname, { scroll: false })
      })
    } else if (
      sessionStorage.getItem("paymentPending") === "true" &&
      sessionStorage.getItem("paymentPendingUserId") === userId
    ) {
      dispatch(setOptimisticPremium(true))
      setShowBanner(true)
      setHandled(true)
      ;[1000, 3000, 6000, 10000].forEach((d) => setTimeout(() => fetchStatus(), d))
    }
  }, [userId, successParam, sessionId])

  useEffect(() => {
    if (isSubscribed && optimisticPremium) {
      dispatch(setOptimisticPremium(false))
      sessionStorage.removeItem("paymentPending")
      sessionStorage.removeItem("paymentPendingUserId")
      const t = setTimeout(() => setShowBanner(false), 3000)
      return () => clearTimeout(t)
    }
  }, [isSubscribed])

  if (!mounted || (loading && !showBanner && !optimisticPremium)) {
    return <SkeletonCard />
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ss-root">
        {showBanner && <PaymentBanner verifying={verifying} />}
        {isPremium ? <PremiumCard expiryDate={expiryDate} /> : <FreeCard />}
      </div>
    </>
  )
}

/* ── Sub-components ─────────────────────────────────────────── */

function SkeletonCard() {
  return (
    <>
      <style>{styles}</style>
      <div className="ss-skeleton" />
    </>
  )
}

function PaymentBanner({ verifying }) {
  return (
    <div className={`ss-banner ${verifying ? "ss-banner--verifying" : ""}`}>
      <span className="ss-banner-icon">
        {verifying ? (
          <svg className="ss-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".35" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </span>
      <div>
        <p className="ss-banner-title">
          {verifying ? "Verifying payment…" : "Premium activated!"}
        </p>
        <p className="ss-banner-sub">
          {verifying ? "Confirming with Stripe." : "Your account is upgraded. Enjoy all premium content."}
        </p>
      </div>
    </div>
  )
}

function PremiumCard({ expiryDate }) {
  return (
    <div className="ss-card ss-card--premium">
      <div className="ss-card-accent ss-card-accent--premium" />

      <div className="ss-card-header">
        <div className="ss-icon-wrap ss-icon-wrap--premium">
          <StarIcon />
          <span className="ss-icon-ring" />
        </div>
        <div className="ss-card-info">
          <span className="ss-label">Current Plan</span>
          <span className="ss-plan-name ss-plan-name--premium">Premium</span>
          {expiryDate && (
            <span className="ss-expiry">
              <CalendarIcon /> Renews {formatDate(expiryDate)}
            </span>
          )}
        </div>
        <span className="ss-badge ss-badge--premium">PRO</span>
      </div>

      <div className="ss-features">
        {FEATURES.map((f) => (
          <span key={f} className="ss-pill ss-pill--premium">
            <CheckIcon /> {f}
          </span>
        ))}
      </div>
    </div>
  )
}

function FreeCard() {
  return (
    <div className="ss-card ss-card--free">
      <div className="ss-card-accent ss-card-accent--free" />

      <div className="ss-card-header">
        <div className="ss-icon-wrap ss-icon-wrap--free">
          <LockIcon />
        </div>
        <div className="ss-card-info">
          <span className="ss-label">Current Plan</span>
          <span className="ss-plan-name ss-plan-name--free">Free</span>
          <span className="ss-expiry">Limited access to content</span>
        </div>
        <span className="ss-badge ss-badge--free">FREE</span>
      </div>

      <Link href="/subscribe" className="ss-upgrade-btn">
        Unlock Premium
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}

/* ── Icons ──────────────────────────────────────────────────── */
const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
)
const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)
const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

/* ── Styles ─────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

  .ss-root {
    font-family: 'Sora', sans-serif;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  /* Skeleton */
  .ss-skeleton {
    height: 120px;
    border-radius: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #fafafa 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0 }
    100% { background-position: -200% 0 }
  }

  /* Banner */
  .ss-banner {
    display: flex;
    align-items: center;
    gap: 14px;
    border-radius: 18px;
    background: linear-gradient(135deg, #059669, #10b981, #0d9488);
    color: #fff;
    padding: 14px 16px;
    box-shadow: 0 6px 20px -4px rgba(16,185,129,.35);
    animation: slideDown .35s cubic-bezier(.22,1,.36,1);
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px) }
    to   { opacity: 1; transform: translateY(0) }
  }
  .ss-banner-icon {
    flex-shrink: 0;
    width: 36px; height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,.18);
    display: flex; align-items: center; justify-content: center;
  }
  .ss-banner-icon svg { width: 18px; height: 18px; }
  .ss-banner--verifying .ss-banner-icon { animation: pulse 1.2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.55} }
  .ss-banner-title { font-size: 13px; font-weight: 700; line-height: 1.3; }
  .ss-banner-sub   { font-size: 11px; opacity: .75; margin-top: 2px; }
  .ss-spin { animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg) } }

  /* Card base */
  .ss-card {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    padding: 18px 16px 16px;
    border: 1px solid transparent;
  }
  .ss-card-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    border-radius: 20px 20px 0 0;
  }

  /* Premium card */
  .ss-card--premium {
    background: linear-gradient(160deg, #f0fdf4 0%, #fff 55%, #f0fdfa 100%);
    border-color: #d1fae5;
  }
  .ss-card-accent--premium {
    background: linear-gradient(90deg, #34d399, #10b981, #2dd4bf);
  }

  /* Free card */
  .ss-card--free {
    background: #fff;
    border-color: #e5e7eb;
  }
  .ss-card-accent--free {
    background: linear-gradient(90deg, #d1d5db, #e5e7eb, #d1d5db);
  }

  /* Header row */
  .ss-card-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  /* Icon */
  .ss-icon-wrap {
    position: relative;
    flex-shrink: 0;
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
  }
  .ss-icon-wrap svg { width: 22px; height: 22px; }
  .ss-icon-wrap--premium {
    background: linear-gradient(135deg, #34d399, #059669);
    box-shadow: 0 4px 14px -3px rgba(16,185,129,.4);
    color: #fff;
  }
  .ss-icon-wrap--free {
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    color: #9ca3af;
  }
  .ss-icon-ring {
    position: absolute; inset: -2px;
    border-radius: 16px;
    border: 2px solid rgba(52,211,153,.4);
    animation: ring 2.5s ease-in-out infinite;
  }
  @keyframes ring {
    0%,100% { opacity: .4; transform: scale(1) }
    50%      { opacity: 0;  transform: scale(1.12) }
  }

  /* Info */
  .ss-card-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .ss-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: #9ca3af;
  }
  .ss-plan-name {
    font-size: 18px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: -.02em;
  }
  .ss-plan-name--premium { color: #065f46; }
  .ss-plan-name--free    { color: #374151; }
  .ss-expiry {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
  }
  .ss-expiry svg { width: 12px; height: 12px; flex-shrink: 0; }

  /* Badge */
  .ss-badge {
    flex-shrink: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .06em;
    padding: 4px 10px;
    border-radius: 100px;
    align-self: flex-start;
  }
  .ss-badge--premium {
    background: #059669;
    color: #fff;
    box-shadow: 0 2px 8px -2px rgba(5,150,105,.4);
  }
  .ss-badge--free {
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    color: #6b7280;
  }

  /* Feature pills */
  .ss-features {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 14px;
  }
  .ss-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 600;
    padding: 5px 10px;
    border-radius: 100px;
  }
  .ss-pill svg { width: 11px; height: 11px; flex-shrink: 0; }
  .ss-pill--premium {
    background: #fff;
    border: 1px solid #d1fae5;
    color: #047857;
  }

  /* Upgrade button */
  .ss-upgrade-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 14px;
    width: 100%;
    padding: 13px 16px;
    border-radius: 14px;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    color: #fff;
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -.01em;
    text-decoration: none;
    box-shadow: 0 4px 16px -4px rgba(79,70,229,.45);
    transition: transform .15s, box-shadow .15s;
    -webkit-tap-highlight-color: transparent;
  }
  .ss-upgrade-btn svg { width: 16px; height: 16px; }
  .ss-upgrade-btn:active {
    transform: scale(.97);
    box-shadow: 0 2px 8px -4px rgba(79,70,229,.3);
  }
  @media (hover: hover) {
    .ss-upgrade-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px -4px rgba(79,70,229,.5);
    }
  }
`
