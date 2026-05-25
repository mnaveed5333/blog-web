"use client"
import { useState, useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import Link from "next/link"
import Modal from "@/components/ui/Modal"
import { RiEditLine, RiDeleteBinLine } from "react-icons/ri"

export default function BlogsTable() {
  const { blogs, fetchAdminBlogs, deleteBlog, loading } = useAdmin()
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { fetchAdminBlogs() }, [])

  async function confirmDelete() {
    await deleteBlog(deleteId)
    setDeleteId(null)
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {["Title", "Type", "Views", "Date", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog._id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-800 font-medium max-w-xs truncate">{blog.title}</td>
                <td className="px-4 py-3">
                  {blog.isPremium
                    ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">PREMIUM</span>
                    : <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">FREE</span>
                  }
                </td>
                <td className="px-4 py-3 text-slate-500">{blog.views}</td>
                <td className="px-4 py-3 text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/blogs/edit/${blog._id}`} className="flex items-center gap-1 text-[#3B82F6] hover:underline text-xs font-medium">
                      <RiEditLine size={13} /> Edit
                    </Link>
                    <button onClick={() => setDeleteId(blog._id)} className="flex items-center gap-1 text-red-500 hover:underline text-xs font-medium">
                      <RiDeleteBinLine size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!blogs.length && !loading && <p className="text-slate-400 text-center py-10 text-sm">No blogs yet</p>}
        {loading && <p className="text-slate-400 text-center py-10 text-sm">Loading...</p>}
      </div>
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This cannot be undone."
      />
    </>
  )
}