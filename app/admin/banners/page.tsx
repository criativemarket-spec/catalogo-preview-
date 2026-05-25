'use client'
// app/admin/banners/page.tsx
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { getBanners, createBanner, updateBanner, deleteBanner } from '@/lib/config'
import { uploadImage } from '@/lib/storage'
import { Banner } from '@/types'
import { Plus, Trash2, Eye, EyeOff, Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const data = await getBanners(false)
    setBanners(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'banners')
      await createBanner({
        imageUrl: url,
        active: true,
        order: banners.length + 1,
        title: '',
        subtitle: '',
        linkUrl: '',
      })
      toast.success('Banner adicionado!')
      load()
    } catch {
      toast.error('Erro ao enviar banner')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleToggle = async (banner: Banner) => {
    await updateBanner(banner.id, { active: !banner.active })
    toast.success(banner.active ? 'Banner desativado' : 'Banner ativado')
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este banner?')) return
    await deleteBanner(id)
    toast.success('Banner excluído')
    load()
  }

  const handleUpdateText = async (id: string, field: 'title' | 'subtitle' | 'linkUrl', value: string) => {
    await updateBanner(id, { [field]: value })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-nude-900">Banners</h1>
          <p className="font-body text-sm text-nude-500 mt-1">Imagens exibidas no slider da home</p>
        </div>
        <label className={`btn-primary flex items-center gap-2 cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {uploading ? 'Enviando...' : 'Adicionar Banner'}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <p className="font-body text-xs text-nude-400 mb-4">
        Dimensão recomendada: 2100×900px (proporção 21:9). JPG ou PNG.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-nude-300 border-t-nude-700 rounded-full animate-spin" />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white p-12 text-center">
          <p className="font-display text-xl text-nude-400">Nenhum banner ainda</p>
          <p className="font-body text-sm text-nude-400 mt-2">Adicione imagens para o slider da página inicial</p>
        </div>
      ) : (
        <div className="space-y-4">
          {banners.map(banner => (
            <div key={banner.id} className={`bg-white p-4 ${!banner.active ? 'opacity-60' : ''}`}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Preview */}
                <div className="relative w-full md:w-64 h-32 bg-nude-100 flex-shrink-0 overflow-hidden">
                  <Image src={banner.imageUrl} alt="Banner" fill className="object-cover" />
                </div>

                {/* Campos */}
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="label-admin">Título (opcional)</label>
                    <input
                      type="text"
                      defaultValue={banner.title}
                      onBlur={e => handleUpdateText(banner.id, 'title', e.target.value)}
                      className="input-admin"
                      placeholder="Ex: Nova Coleção Verão"
                    />
                  </div>
                  <div>
                    <label className="label-admin">Subtítulo (opcional)</label>
                    <input
                      type="text"
                      defaultValue={banner.subtitle}
                      onBlur={e => handleUpdateText(banner.id, 'subtitle', e.target.value)}
                      className="input-admin"
                      placeholder="Ex: Fragrâncias exclusivas do Brasil"
                    />
                  </div>
                </div>

                {/* Ações */}
                <div className="flex md:flex-col items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleToggle(banner)}
                    className={`p-2 rounded transition-colors ${banner.active ? 'text-green-500 hover:text-green-700' : 'text-nude-400 hover:text-nude-600'}`}
                    title={banner.active ? 'Desativar' : 'Ativar'}
                  >
                    {banner.active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="p-2 text-nude-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
