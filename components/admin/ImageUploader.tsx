'use client'
// components/admin/ImageUploader.tsx
import { useState, useRef } from 'react'
import Image from 'next/image'
import { uploadImage } from '@/lib/storage'
import { Upload, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  folder?: 'products' | 'banners' | 'categories'
  label?: string
  aspectRatio?: string
}

export default function ImageUploader({
  value,
  onChange,
  folder = 'products',
  label = 'Imagem',
  aspectRatio = '1/1',
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
      toast.success('Imagem enviada!')
    } catch {
      toast.error('Erro ao enviar imagem')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="label-admin">{label}</label>
      {value ? (
        <div className="relative inline-block group">
          <div className="relative bg-nude-100 overflow-hidden" style={{ aspectRatio, width: '120px' }}>
            <Image src={value} alt={label} fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={10} />
          </button>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center border-2 border-dashed border-nude-200 p-6 cursor-pointer hover:border-nude-400 transition-colors w-32 h-32 ${uploading ? 'opacity-50' : ''}`}>
          {uploading
            ? <Loader2 size={20} className="text-nude-400 animate-spin" />
            : <Upload size={20} className="text-nude-400" />
          }
          <p className="font-body text-[10px] text-nude-400 mt-2 text-center">
            {uploading ? 'Enviando...' : 'Upload'}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}
