"use client"
import { useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import UsersTable from "@/components/admin/UsersTable"

export default function UsersPage() {
  const { fetchUsers } = useAdmin()
  useEffect(() => { fetchUsers() }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Users</h1>
        <p className="text-slate-500 text-sm mt-1">Manage registered users</p>
      </div>
      <UsersTable />
    </div>
  )
}