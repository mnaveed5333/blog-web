"use client"
import { useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import { RiDeleteBinLine, RiUserLine, RiShieldLine } from "react-icons/ri"

export default function UsersTable() {
  const { users, deleteUser, loading, fetchUsers } = useAdmin()

  useEffect(() => {
    fetchUsers()
  }, [])

  const adminUsers = users.filter(user => user.role === "admin")
  const nonAdminUsers = users.filter(user => user.role !== "admin")
  const sortedUsers = [...adminUsers, ...nonAdminUsers]

  return (
    <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
      <div className="px-6 py-4 bg-blue-600">
        <h2 className="text-white font-semibold text-sm tracking-wide">Registered Users</h2>
        <p className="text-blue-200 text-xs mt-0.5">{users.length} total users</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-blue-50 border-b border-blue-100">
              <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">User</th>
              <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Email</th>
              <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Role</th>
              <th className="text-right px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50">
            {sortedUsers.map(user => (
              <tr
                key={user._id}
                className={user.role === "admin" ? "bg-blue-50/70" : "hover:bg-blue-50/50"}
              >
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      user.role === "admin" ? "bg-blue-600" : "bg-blue-100"
                    }`}>
                      {user.role === "admin"
                        ? <RiShieldLine size={13} className="text-white" />
                        : <RiUserLine size={13} className="text-blue-500" />
                      }
                    </div>
                    <span className="text-slate-800 font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-slate-500 text-xs">{user.email}</td>
                <td className="px-6 py-3.5">
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${
                    user.role === "admin"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {user.role === "admin" && <RiShieldLine size={11} />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                    >
                      <RiDeleteBinLine size={12} /> Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!users.length && !loading && (
        <div className="text-center py-12">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <RiUserLine size={18} className="text-blue-300" />
          </div>
          <p className="text-slate-400 text-sm">No users found</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">Loading users...</p>
        </div>
      )}
    </div>
  )
}