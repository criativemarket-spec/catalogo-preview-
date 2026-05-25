'use client'
// app/admin/produtos/[id]/page.tsx
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'
import { getProductById, updateProduct } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import { Product, Category } from '@/types'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

export default function EditarProdutoPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([getProductById(id), getCategories(false)]).then(([prod, cats]) => {
      setProduct(prod)
      setCategories(cats)
      setLoading(false)
    })
  }, [id])

  const handleSubmit = async (data: any) => {
    setSaving(true)
    try {
      await updateProduct(id, data)
      toast.success('Produto atualizado!')
      router.push('/admin/produtos')
    } catch {
      toast.error('Erro ao atualizar produto')
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-nude-300 border-t-nude-700 rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="text-center py-24">
      <p className="font-display text-xl text-nude-500">Produto não encontrado</p>
      <Link href="/admin/produtos" className="btn-primary mt-4 inline-block">Voltar</Link>
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/produtos" className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-nude-400 hover:text-nude-600 transition-colors mb-4">
          <ArrowLeft size={14} /> Voltar
        </Link>
        <h1 className="font-display text-3xl font-light text-nude-900">Editar Produto</h1>
        <p className="font-body text-sm text-nude-500 mt-1">{product.name}</p>
      </div>
      <ProductForm initialData={product} categories={categories} onSubmit={handleSubmit} loading={saving} />
    </div>
  )
}
