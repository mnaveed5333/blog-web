"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  RiDashboardLine, RiArticleLine, RiAddCircleLine,
  RiGroupLine, RiBankCardLine, RiShieldLine
} from "react-icons/ri"

const links = [
  { href: "/admin", label: "Dashboard", icon: RiDashboardLine },
  { href: "/admin/blogs", label: "Blogs", icon: RiArticleLine },
  { href: "/admin/blogs/create", label: "New Blog", icon: RiAddCircleLine },
  { href: "/admin/users", label: "Users", icon: RiGroupLine },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: RiBankCardLine },
]

export default function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200 flex flex-col p-4">
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <RiShieldLine size={20} className="text-[#3B82F6]" />
        <span className="font-bold text-slate-800 text-sm tracking-wide">Admin Panel</span>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-[#3B82F6] text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}