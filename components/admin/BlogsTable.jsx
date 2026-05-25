"use client"
import { useState, useEffect } from "react"
import { useAdmin } from "@/hooks/useAdmin"
import Link from "next/link"
import Modal from "@/components/ui/Modal"
import { RiEditLine, RiDeleteBinLine, RiArticleLine } from "react-icons/ri"

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
      <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm">
        <div className="px-6 py-4 bg-blue-600">
          <h2 className="text-white font-semibold text-sm tracking-wide">All Blogs</h2>
          <p className="text-blue-200 text-xs mt-0.5">{blogs.length} total blogs</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-blue-50 border-b border-blue-100">
                <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Views</th>
                <th className="text-left px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-3 text-blue-600 font-semibold text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {blogs.map(blog => (
                <tr key={blog._id} className="hover:bg-blue-50/50">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <RiArticleLine size={13} className="text-blue-500" />
                      </div>
                      <span className="text-slate-800 font-medium max-w-xs truncate">{blog.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    {blog.isPremium
                      ? <span className="inline-flex text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">Premium</span>
                      : <span className="inline-flex text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-semibold">Free</span>
                    }
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 text-xs">{blog.views ?? 0}</td>
                  <td className="px-6 py-3.5 text-slate-500 text-xs">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blogs/edit/${blog._id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-1.5 rounded-lg"
                      >
                        <RiEditLine size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(blog._id)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                      >
                        <RiDeleteBinLine size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!blogs.length && !loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-3">
              <RiArticleLine size={18} className="text-blue-300" />
            </div>
            <p className="text-slate-400 text-sm">No blogs yet</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">Loading blogs...</p>
          </div>
        )}
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