"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiDashboardLine, RiArticleLine, RiAddCircleLine,
  RiGroupLine, RiShieldLine, RiMenuFoldLine, RiMenuUnfoldLine
} from "react-icons/ri"

const links = [
  { href: "/admin",              label: "Dashboard", icon: RiDashboardLine  },
  { href: "/admin/blogs",        label: "Blogs",     icon: RiArticleLine    },
  { href: "/admin/blogs/create", label: "New Blog",  icon: RiAddCircleLine  },
  { href: "/admin/users",        label: "Users",     icon: RiGroupLine      },
]

export default function AdminSidebar() {
  const path = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`min-h-screen bg-white border-r border-blue-100 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>

      {/* Header */}
      <div className="bg-blue-600 px-3 py-4 flex items-center justify-between gap-2">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <RiShieldLine size={18} className="text-white flex-shrink-0" />
            <span className="font-semibold text-white text-sm tracking-wide">Admin Panel</span>
          </div>
        )}
        {collapsed && <RiShieldLine size={18} className="text-white mx-auto" />}
        <button
          onClick={() => setCollapsed(p => !p)}
          className={`text-blue-200 hover:text-white flex-shrink-0 ${collapsed ? "mx-auto mt-3" : ""}`}
        >
          {collapsed
            ? <RiMenuUnfoldLine size={18} />
            : <RiMenuFoldLine size={18} />
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 mt-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={17} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}