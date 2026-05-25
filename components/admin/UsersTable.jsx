"use client"
import { useAdmin } from "@/hooks/useAdmin"
import { RiDeleteBinLine, RiUserLine, RiShieldLine } from "react-icons/ri"

export default function UsersTable() {
  const { users, deleteUser, loading } = useAdmin()

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {["Name", "Email", "Role", "Subscribed", "Action"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-slate-800 font-medium flex items-center gap-2">
                <RiUserLine size={14} className="text-slate-400" /> {user.name}
              </td>
              <td className="px-4 py-3 text-slate-500">{user.email}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 w-fit ${
                  user.role === "admin" ? "bg-blue-100 text-[#3B82F6]" : "bg-slate-100 text-slate-600"
                }`}>
                  {user.role === "admin" && <RiShieldLine size={11} />} {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                {user.isSubscribed
                  ? <span className="text-xs bg-cyan-100 text-[#06B6D4] px-2 py-0.5 rounded-full font-semibold">Active</span>
                  : <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Free</span>
                }
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => deleteUser(user._id)}
                  className="flex items-center gap-1 text-red-500 hover:underline text-xs font-medium"
                >
                  <RiDeleteBinLine size={13} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!users.length && !loading && <p className="text-slate-400 text-center py-10 text-sm">No users found</p>}
      {loading && <p className="text-slate-400 text-center py-10 text-sm">Loading...</p>}
    </div>
  )
}