'use client'
// components/admin/ConfirmDialog.tsx
import { AlertTriangle } from 'lucide-react'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  onConfirm,
  onCancel,
  danger = true,
}: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white max-w-sm w-full p-6 animate-scale-in">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-nude-100'}`}>
            <AlertTriangle size={18} className={danger ? 'text-red-500' : 'text-nude-600'} />
          </div>
          <div>
            <h3 className="font-body text-sm font-medium text-nude-900 mb-1">{title}</h3>
            <p className="font-body text-sm text-nude-500">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-outline px-5 py-2 text-xs">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 font-body text-xs tracking-widest uppercase text-white transition-colors ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-nude-800 hover:bg-nude-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
