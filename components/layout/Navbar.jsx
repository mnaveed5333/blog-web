"use client"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useSubscription } from "@/hooks/useSubscription"
import { usePathname } from "next/navigation"
import { FiUser, FiLogOut, FiShield, FiFileText, FiHome, FiStar } from "react-icons/fi"
import { RiWhatsappLine, RiDashboardLine, RiArticleLine, RiAddCircleLine, RiGroupLine, RiBankCardLine } from "react-icons/ri"
import WhatsAppModal from "@/components/layout/WhatsappModal"

export default function Navbar() {
  const { user, logout, authReady } = useAuth()
  const { isSubscribed } = useSubscription()
  const path = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [whatsappOpen, setWhatsappOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isHome = path === "/"
  const isAdmin = path.startsWith("/admin")

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const avatarLetter = user?.email?.charAt(0).toUpperCase() || "?"

  const navLinks = [
    { href: "/blogs",     label: "All Blogs",  icon: FiFileText },
    { href: "/dashboard", label: "Dashboard",  icon: FiHome     },
    { href: "/subscribe", label: "Subscribe",  icon: FiStar     },
  ]

  const adminLinks = [
    { href: "/admin",               label: "Dashboard",      icon: RiDashboardLine },
    { href: "/admin/blogs",         label: "Blogs",          icon: RiArticleLine   },
    { href: "/admin/blogs/create",  label: "New Blog",       icon: RiAddCircleLine },
    { href: "/admin/users",         label: "Users",          icon: RiGroupLine     },
    
  ]

  return (
    <>
      <nav className={`px-6 h-[60px] flex items-center justify-between sticky top-0 z-50 transition-all ${
        isHome
          ? "bg-transparent border-b border-white/10"
          : "bg-white border-b border-slate-100"
      }`}>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <span style={{
            fontSize: "20px",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            ...(isHome
              ? { color: "white" }
              : {
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
            )
          }}>
            Readify
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {!authReady ? (
            <div className={`w-24 h-8 rounded-lg animate-pulse ${isHome ? "bg-white/20" : "bg-slate-100"}`} />
          ) : !user ? (
            <>
              <Link
                href="/login"
                className="text-sm px-4 py-1.5 rounded-lg border font-medium transition-all"
                style={{
                  textDecoration: "none",
                  color: isHome ? "white" : "#64748b",
                  borderColor: isHome ? "rgba(255,255,255,0.3)" : "#e2e8f0",
                  background: isHome ? "rgba(255,255,255,0.1)" : "transparent",
                }}
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm text-white px-4 py-1.5 rounded-lg font-bold transition-all"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 2px 10px rgba(37,99,235,0.35)",
                  textDecoration: "none",
                }}
              >
                Get started free
              </Link>
            </>
          ) : (
            <>
              {!isAdmin && (
                <button
                  onClick={() => setWhatsappOpen(true)}
                  title="Contact us on WhatsApp"
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-all hover:opacity-85 active:scale-95"
                  style={{
                    background: isHome ? "rgba(37,211,102,0.2)" : "#f0fdf4",
                    color: isHome ? "#fff" : "#16a34a",
                    border: isHome ? "1px solid rgba(37,211,102,0.4)" : "1px solid #bbf7d0",
                    cursor: "pointer",
                  }}
                >
                  <RiWhatsappLine size={15} />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              )}

              <div className={`w-px h-5 mx-1 ${isHome ? "bg-white/20" : "bg-slate-100"}`} />

              {isSubscribed && (
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold tracking-wide border border-blue-100">
                  PRO
                </span>
              )}
              {user.role === "admin" && (
                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium border border-red-100">
                  Admin
                </span>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                  title={user.email}
                  style={{
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {avatarLetter}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50 max-h-[80vh] overflow-y-auto">

                    {/* User info */}
                    <div className="px-3.5 py-3 border-b border-slate-100 flex items-center gap-2.5 mb-1">
                      <div
                        className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
                      >
                        {avatarLetter}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    {/* Regular nav links — hidden when inside admin */}
                    {!isAdmin && navLinks.map(({ href, label, icon: Icon }) => {
                      const active = path === href
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-sm transition-all"
                          style={{
                            textDecoration: "none",
                            color: active ? "#2563eb" : "#475569",
                            background: active ? "#eff6ff" : "transparent",
                            fontWeight: active ? 600 : 400,
                          }}
                          onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f8fafc" }}
                          onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}
                        >
                          <Icon size={14} />
                          {label}
                        </Link>
                      )
                    })}

                    <div className="border-t border-slate-100 my-1" />

                    {/* Profile */}
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-all"
                      style={{ textDecoration: "none" }}
                    >
                      <FiUser size={14} /> Profile
                    </Link>

                    {/* Admin section — only for admin role */}
                    {user.role === "admin" && (
                      <>
                        <div className="border-t border-slate-100 my-1" />
                        <p className="px-3.5 pt-1 pb-1 text-[10px] font-semibold uppercase tracking-widest text-red-400">
                          Admin
                        </p>
                        {adminLinks.map(({ href, label, icon: Icon }) => {
                          const active = path === href
                          return (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-3.5 py-2 text-sm transition-all"
                              style={{
                                textDecoration: "none",
                                color: active ? "#dc2626" : "#ef4444",
                                background: active ? "#fef2f2" : "transparent",
                                fontWeight: active ? 600 : 400,
                              }}
                              onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#fff5f5" }}
                              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent" }}
                            >
                              <Icon size={14} />
                              {label}
                            </Link>
                          )
                        })}
                      </>
                    )}

                    {/* Logout */}
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => { setDropdownOpen(false); logout() }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-all text-left"
                        style={{ background: "none", border: "none", cursor: "pointer" }}
                      >
                        <FiLogOut size={14} /> Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {whatsappOpen && (
        <WhatsAppModal onClose={() => setWhatsappOpen(false)} />
      )}
    </>
  )
}