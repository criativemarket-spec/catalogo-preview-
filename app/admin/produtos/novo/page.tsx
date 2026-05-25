'use client'
// app/admin/produtos/novo/page.tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import { getCategories } from '@/lib/categories'
import { createProduct } from '@/lib/products'
import { Category } from '@/types'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NovoProdutoPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getCategories(false).then(setCategories)
  }, [])

  const handleSubmit = async (data: any) => {
    setSaving(true)
    try {
      await createProduct(data)
      toast.success('Produto criado com sucesso!')
      router.push('/admin/produtos')
    } catch {
      toast.error('Erro ao criar produto')
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/produtos" className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-nude-400 hover:text-nude-600 transition-colors mb-4">
          <ArrowLeft size={14} /> Voltar
        </Link>
        <h1 className="font-display text-3xl font-light text-nude-900">Novo Produto</h1>
      </div>
      <ProductForm categories={categories} onSubmit={handleSubmit} loading={saving} />
    </div>
  )
}
