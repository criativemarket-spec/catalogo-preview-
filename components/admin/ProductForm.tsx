'use client'
// components/admin/ProductForm.tsx
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Product, Category } from '@/types'
import { X, Plus, Loader2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

interface ProductFormProps {
  initialData?: Partial<Product>
  categories: Category[]
  onSubmit: (data: Omit<Product, 'id' | 'createdAt'>) => Promise<void>
  loading?: boolean
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export default function ProductForm({ initialData, categories, onSubmit, loading = false }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [price, setPrice] = useState(initialData?.price?.toString() || '')
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || '')
  const [sku, setSku] = useState(initialData?.sku || '')
  const [visible, setVisible] = useState(initialData?.visible ?? true)
  const [featured, setFeatured] = useState(initialData?.featured ?? false)
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET || 'brasil_premium')
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME || 'dz0h8hyvl'}/image/upload`, {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (data.secure_url) urls.push(data.secure_url)
      }
      setImages(prev => [...prev, ...urls])
      toast.success(`${urls.length} foto(s) enviada(s)!`)
    } catch {
      toast.error('Erro ao enviar fotos')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || !categoryId) {
      toast.error('Preencha nome, preço e categoria')
      return
    }
    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      categoryId,
      sku: sku.trim(),
      visible,
      featured,
      images,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informações básicas */}
      <div className="bg-white p-6 md:p-8 space-y-5">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-400 mb-5">
          Informações do produto
        </p>
        <div>
          <label className="label-admin">Nome do produto *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-admin" placeholder="Ex: Geleia Hidratante Romã 200ml" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="label-admin">Preço (€) *</label>
            <input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className="input-admin" placeholder="0.00" required />
          </div>
          <div>
            <label className="label-admin">Código (opcional)</label>
            <input type="text" value={sku} onChange={e => setSku(e.target.value)} className="input-admin" placeholder="Ex: GEL-001" />
          </div>
        </div>
        <div>
          <label className="label-admin">Categoria *</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="input-admin" required>
            <option value="">Selecione uma categoria</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-admin">Descrição</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="input-admin resize-none" rows={4} placeholder="Descreva o produto..." />
        </div>
      </div>

      {/* Upload de fotos */}
      <div className="bg-white p-6 md:p-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-400 mb-5">
          Fotos do produto
        </p>

        {/* Área de upload */}
        <label className={`flex flex-col items-center justify-center border-2 border-dashed border-nude-200 p-8 cursor-pointer hover:border-nude-400 transition-colors mb-4 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {uploading ? (
            <>
              <Loader2 size={28} className="text-nude-400 animate-spin mb-2" />
              <p className="font-body text-sm text-nude-500">Enviando fotos...</p>
            </>
          ) : (
            <>
              <Upload size={28} className="text-nude-400 mb-2" />
              <p className="font-body text-sm text-nude-500 mb-1">Clique para selecionar fotos</p>
              <p className="font-body text-xs text-nude-400">JPG, PNG, WebP — múltiplas fotos de uma vez</p>
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>

        {/* Preview das fotos */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {images.map((url, i) => (
              <div key={i} className="relative group">
                <div className="relative bg-nude-100 overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  <Image src={url} alt={`Foto ${i + 1}`} fill className="object-cover" unoptimized />
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-nude-800/70 text-cream text-[9px] text-center py-1 font-body tracking-widest uppercase">
                      Principal
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
        {images.length === 0 && (
          <p className="font-body text-xs text-nude-400 text-center">Nenhuma foto adicionada ainda</p>
        )}
      </div>

      {/* Configurações */}
      <div className="bg-white p-6 md:p-8">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-400 mb-5">Configurações</p>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={visible} onChange={e => setVisible(e.target.checked)} className="w-4 h-4 accent-nude-700" />
            <div>
              <p className="font-body text-sm text-nude-700">Produto visível no catálogo</p>
              <p className="font-body text-xs text-nude-400">Desmarque para ocultar sem excluir</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 accent-nude-700" />
            <div>
              <p className="font-body text-sm text-nude-700">Produto em destaque</p>
              <p className="font-body text-xs text-nude-400">Aparece na página inicial</p>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading || uploading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Salvando...' : 'Salvar Produto'}
        </button>
        <a href="/admin/produtos" className="btn-outline">Cancelar</a>
      </div>
    </form>
  )
}
