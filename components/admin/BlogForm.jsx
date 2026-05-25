"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/hooks/useAdmin"
import { RiImageAddLine, RiCloseLine, RiSaveLine, RiLoader4Line } from "react-icons/ri"

export default function BlogForm({ mode = "create", initialData = {} }) {
  const { createBlog, updateBlog } = useAdmin()
  const router = useRouter()
  const fileRef = useRef()

  const [form, setForm] = useState({
    title: initialData.title || "",
    excerpt: initialData.excerpt || "",
    content: initialData.content || "",
    category: initialData.category || "",
    isPremium: initialData.isPremium || false,
    tags: initialData.tags?.join(", ") || "",
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData.coverImage || null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadImage() {
    if (!imageFile) return imagePreview
    setUploading(true)
    const fd = new FormData()
    fd.append("file", imageFile)
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      return data.url
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const coverImage = await uploadImage()
      const payload = {
        ...form,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        coverImage,
      }
      if (mode === "create") {
        await createBlog(payload)
      } else {
        await updateBlog(initialData._id, payload)
      }
      router.push("/admin/blogs")
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-3xl">
      <div className="space-y-5">

        {/* Cover Image — 16:9 (1280×720 recommended, max 2MB, JPG or PNG) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Cover Image
            <span className="ml-2 text-xs font-normal text-slate-400">1280×720 · 16:9 · JPG/PNG/WebP · max 2MB</span>
          </label>
          <div
            onClick={() => fileRef.current.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#3B82F6] transition-colors relative overflow-hidden bg-slate-50"
            style={{ aspectRatio: "16/9" }}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setImagePreview(null); setImageFile(null) }}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-slate-600 hover:text-red-500"
                >
                  <RiCloseLine size={16} />
                </button>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <RiImageAddLine size={32} />
                <span className="text-sm">Click to upload cover image</span>
                <span className="text-xs text-slate-300">Recommended: 1280 × 720 px · JPG, PNG, or WebP</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/jpg,image/webp" onChange={handleImageChange} className="hidden" />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input
            name="title" value={form.title} onChange={handleChange}
            placeholder="Blog title..."
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt</label>
          <textarea
            name="excerpt" value={form.excerpt} onChange={handleChange}
            rows={2} placeholder="Short description..."
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
          <textarea
            name="content" value={form.content} onChange={handleChange}
            rows={10} placeholder="Write your blog content here..."
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
          />
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input
              name="category" value={form.category} onChange={handleChange}
              placeholder="e.g. Technology"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
            <input
              name="tags" value={form.tags} onChange={handleChange}
              placeholder="e.g. nextjs, react"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
        </div>

        {/* Premium Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox" id="isPremium" name="isPremium"
            checked={form.isPremium} onChange={handleChange}
            className="w-4 h-4 accent-[#3B82F6]"
          />
          <label htmlFor="isPremium" className="text-sm text-slate-700 font-medium">Mark as Premium</label>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-[#3B82F6] hover:bg-blue-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {saving || uploading ? <RiLoader4Line size={16} className="animate-spin" /> : <RiSaveLine size={16} />}
            {mode === "create" ? "Publish Blog" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
