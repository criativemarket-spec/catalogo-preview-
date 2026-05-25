'use client'
// app/admin/produtos/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllProductsAdmin, deleteProduct, updateProduct } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import { Product, Category } from '@/types'
import { formatPrice } from '@/lib/whatsapp'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden' | 'featured'>('all')
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)

  const load = async () => {
    const [prods, cats] = await Promise.all([getAllProductsAdmin(), getCategories(false)])
    setProducts(prods)
    setCategories(cats)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = (id: string, name: string) => {
    setConfirmDelete({ id, name })
  }

  const confirmDeletion = async () => {
    if (!confirmDelete) return
    await deleteProduct(confirmDelete.id)
    toast.success('Produto excluído')
    setConfirmDelete(null)
    load()
  }

  const handleToggle = async (product: Product, field: 'visible' | 'featured') => {
    await updateProduct(product.id, { [field]: !product[field] })
    toast.success(field === 'visible'
      ? (product.visible ? 'Produto ocultado' : 'Produto visível')
      : (product.featured ? 'Destaque removido' : 'Produto em destaque'))
    load()
  }

  const filtered = products
    .filter(p => {
      if (filter === 'visible') return p.visible
      if (filter === 'hidden') return !p.visible
      if (filter === 'featured') return p.featured
      return true
    })
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-light text-nude-900">Produtos</h1>
            <p className="font-body text-sm text-nude-500 mt-1">{products.length} produto(s) cadastrado(s)</p>
          </div>
          <Link href="/admin/produtos/novo" className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Novo Produto
          </Link>
        </div>

        <div className="bg-white p-4 mb-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-nude-400" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-admin pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'visible', 'hidden', 'featured'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 font-body text-xs tracking-widest uppercase transition-all ${
                  filter === f ? 'bg-nude-800 text-cream' : 'border border-nude-200 text-nude-600 hover:border-nude-400'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'visible' ? 'Visíveis' : f === 'hidden' ? 'Ocultos' : 'Destaques'}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white overflow-x-auto">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-nude-300 border-t-nude-700 rounded-full animate-spin mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-display text-xl text-nude-400">Nenhum produto encontrado</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-nude-100">
                  <th className="text-left p-4 font-body text-[10px] tracking-[0.3em] uppercase text-nude-400">Produto</th>
                  <th className="text-left p-4 font-body text-[10px] tracking-[0.3em] uppercase text-nude-400 hidden md:table-cell">Categoria</th>
                  <th className="text-left p-4 font-body text-[10px] tracking-[0.3em] uppercase text-nude-400">Preço</th>
                  <th className="text-center p-4 font-body text-[10px] tracking-[0.3em] uppercase text-nude-400">Visível</th>
                  <th className="text-center p-4 font-body text-[10px] tracking-[0.3em] uppercase text-nude-400">Destaque</th>
                  <th className="text-right p-4 font-body text-[10px] tracking-[0.3em] uppercase text-nude-400">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => {
                  const cat = categories.find(c => c.id === product.categoryId)
                  return (
                    <tr key={product.id} className="border-b border-nude-50 hover:bg-nude-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 bg-nude-100 flex-shrink-0 overflow-hidden">
                            {product.images?.[0] ? (
                              <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-body text-sm text-nude-800 font-medium line-clamp-1">{product.name}</p>
                            {product.sku && <p className="font-body text-[10px] text-nude-400">#{product.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="font-body text-xs text-nude-500">{cat?.name || '—'}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-body text-sm font-medium text-[#B8860B]">
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggle(product, 'visible')}
                          className={`p-2 rounded-full transition-colors ${
                            product.visible ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-nude-100 text-nude-400 hover:bg-nude-200'
                          }`}
                        >
                          {product.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggle(product, 'featured')}
                          className={`p-2 rounded-full transition-colors ${
                            product.featured ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'bg-nude-100 text-nude-400 hover:bg-nude-200'
                          }`}
                        >
                          <Star size={15} fill={product.featured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/produtos/${product.id}`} className="p-2 text-nude-400 hover:text-nude-700 transition-colors">
                            <Edit2 size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 text-nude-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Excluir produto"
        message={`Tem certeza que deseja excluir "${confirmDelete?.name}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={confirmDeletion}
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  )
}
