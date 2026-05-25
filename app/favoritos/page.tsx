'use client'
// app/favoritos/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/ui/ProductCard'
import { useFavorites } from '@/context/FavoritesContext'
import { getCategories } from '@/lib/categories'
import { getSiteConfig } from '@/lib/config'
import { Category, SiteConfig } from '@/types'
import { Heart } from 'lucide-react'

export default function FavoritosPage() {
  const { favorites } = useFavorites()
  const [categories, setCategories] = useState<Category[]>([])
  const [config, setConfig] = useState<SiteConfig | null>(null)

  useEffect(() => {
    Promise.all([getCategories(), getSiteConfig()]).then(([cats, cfg]) => {
      setCategories(cats)
      setConfig(cfg)
    })
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      <Header categories={categories} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="mb-10">
          <p className="section-subtitle mb-3">Lista pessoal</p>
          <h1 className="section-title">Favoritos</h1>
          <div className="h-px w-12 bg-[var(--color-gold)] mt-4" />
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-24 bg-white">
            <Heart size={40} className="text-nude-200 mx-auto mb-4" />
            <p className="font-display text-2xl font-light text-nude-600 mb-2">
              Nenhum favorito ainda
            </p>
            <p className="font-body text-sm text-nude-400 mb-8">
              Clique no coração nos produtos para salvá-los aqui
            </p>
            <Link href="/catalogo" className="btn-primary">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favorites.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  categoryName: categories.find(c => c.id === product.categoryId)?.name,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {config && (
        <Footer
          whatsappNumber={config.whatsappNumber}
          storeName={config.storeName}
          instagramUrl={config.instagramUrl}
        />
      )}
    </div>
  )
}
