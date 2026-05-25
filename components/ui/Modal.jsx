"use client"
import { RiAlertLine } from "react-icons/ri"

export default function Modal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-100 p-2 rounded-full">
            <RiAlertLine size={18} className="text-red-500" />
          </div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
        <p className="text-sm text-slate-500 mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}