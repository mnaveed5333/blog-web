"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { FiFileText, FiHome, FiStar, FiChevronLeft, FiChevronRight, FiMenu } from "react-icons/fi"

export default function Sidebar() {
  const path = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const links = [
    { href: "/blogs", label: "All Blogs", icon: <FiFileText size={18} /> },
    { href: "/dashboard", label: "Dashboard", icon: <FiHome size={18} /> },
    { href: "/subscribe", label: "Subscribe", icon: <FiStar size={18} /> },
  ]

  return (
    <aside
      className={`relative min-h-screen bg-white border-r border-slate-200 p-3 flex flex-col transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center mb-6 px-1 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Menu</p>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
        </button>
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-1">
        {links.map((l) => {
          const isActive = path === l.href
          return (
            <Link
              key={l.href}
              href={l.href}
              title={collapsed ? l.label : undefined}
              className={`flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <span className="shrink-0">{l.icon}</span>
              {!collapsed && <span className="truncate">{l.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}