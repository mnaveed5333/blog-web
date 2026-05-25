"use client"
import { useState } from "react"
import { FiX, FiSend } from "react-icons/fi"
import { RiWhatsappLine, RiMailLine, RiUserLine, RiMessage2Line } from "react-icons/ri"

const WHATSAPP_NUMBER = "923001234567"

export default function WhatsAppModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sending, setSending] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.message) return
    setSending(true)
    const text = ` Hello!\n\n*Name:* ${form.name}\n*Email:* ${form.email}\n\n*Message:*\n${form.message}`
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
    setSending(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 bg-blue-600"
          
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center">
              <RiWhatsappLine size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight">Contact Us</h3>
              <p className="text-green-100 text-xs mt-0.5">We'll reply on WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/35 flex items-center justify-center transition-all"
            style={{ border: "none", cursor: "pointer" }}
          >
            <FiX size={16} className="text-white" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Your Name <span className="text-red-400 normal-case">*</span>
              </label>
              <div className="relative">
                <RiUserLine size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <RiMailLine size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Message <span className="text-red-400 normal-case">*</span>
              </label>
              <div className="relative">
                <RiMessage2Line size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                <textarea
                  placeholder="Write your message here..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending || !form.name || !form.message}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98] bg-blue-600"
              
            >
              <RiWhatsappLine size={17} />
              {sending ? "Opening WhatsApp..." : "Send via WhatsApp"}
              <FiSend size={13} />
            </button>

            <p className="text-center text-xs text-slate-400">
              Clicking send will open WhatsApp with your message pre-filled.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}