'use client'
// app/admin/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllProductsAdmin } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import { getBanners } from '@/lib/config'
import { Package, Tag, Image, Eye, EyeOff, Star, Plus, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    visibleProducts: 0,
    featuredProducts: 0,
    totalCategories: 0,
    totalBanners: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllProductsAdmin(), getCategories(false), getBanners(false)]).then(([products, cats, banners]) => {
      setStats({
        totalProducts: products.length,
        visibleProducts: products.filter(p => p.visible).length,
        featuredProducts: products.filter(p => p.featured).length,
        totalCategories: cats.length,
        totalBanners: banners.length,
      })
      setLoading(false)
    })
  }, [])

  const cards = [
    { label: 'Total de Produtos', value: stats.totalProducts, icon: Package, href: '/admin/produtos', color: 'bg-nude-100 text-nude-700' },
    { label: 'Visíveis', value: stats.visibleProducts, icon: Eye, href: '/admin/produtos', color: 'bg-green-50 text-green-700' },
    { label: 'Destaques', value: stats.featuredProducts, icon: Star, href: '/admin/produtos', color: 'bg-amber-50 text-amber-700' },
    { label: 'Categorias', value: stats.totalCategories, icon: Tag, href: '/admin/categorias', color: 'bg-blue-50 text-blue-700' },
    { label: 'Banners', value: stats.totalBanners, icon: Image, href: '/admin/banners', color: 'bg-purple-50 text-purple-700' },
  ]

  const quickActions = [
    { label: 'Novo Produto', href: '/admin/produtos/novo', icon: Plus },
    { label: 'Ver Catálogo', href: '/catalogo', icon: ArrowRight },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-nude-900">Bem-vinda de volta</h1>
        <p className="font-body text-sm text-nude-500 mt-1">Gerencie o seu catálogo aqui</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map(card => (
          <Link key={card.label} href={card.href} className="bg-white p-5 hover:shadow-card transition-shadow">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon size={18} />
            </div>
            <p className="font-display text-3xl font-light text-nude-900">
              {loading ? '—' : card.value}
            </p>
            <p className="font-body text-xs text-nude-500 tracking-wide mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="bg-white p-6">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-500 mb-4">Ações Rápidas</p>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(action => (
            <Link key={action.label} href={action.href} className="btn-outline flex items-center gap-2">
              <action.icon size={14} />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
