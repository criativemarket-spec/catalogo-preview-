'use client'
// app/catalogo/CatalogoClient.tsx
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/ui/ProductCard'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'
import { getProducts, searchProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import { getSiteConfig } from '@/lib/config'
import { Product, Category, SiteConfig } from '@/types'
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export default function CatalogoClient() {
  const searchParams = useSearchParams()
  const categoriaParam = searchParams.get('categoria')
  const buscaParam = searchParams.get('busca')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default')
  const [searchTerm, setSearchTerm] = useState(buscaParam || '')
  const [filterOpen, setFilterOpen] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 400)

  useEffect(() => {
    Promise.all([getCategories(), getSiteConfig()]).then(([cats, cfg]) => {
      setCategories(cats)
      setConfig(cfg)
      if (categoriaParam) {
        const found = cats.find(c => c.slug === categoriaParam)
        if (found) setSelectedCategory(found.id)
      }
    })
  }, [categoriaParam])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    try {
      let data: Product[]
      if (debouncedSearch.trim()) {
        data = await searchProducts(debouncedSearch.trim())
      } else {
        data = await getProducts({ categoryId: selectedCategory || undefined })
      }
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, debouncedSearch])

  useEffect(() => { loadProducts() }, [loadProducts])

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const activeCategory = categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-cream">
      <Header categories={categories} />

      {/* Título */}
      <div className="bg-white border-b border-nude-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <p className="section-subtitle mb-3">
            {activeCategory ? activeCategory.name : 'Todos os Produtos'}
          </p>
          <h1 className="section-title">
            {buscaParam ? `Resultados para "${buscaParam}"` : 'Catálogo'}
          </h1>
          <div className="h-px w-12 bg-[var(--color-gold)] mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Barra de filtros */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
          {/* Campo de busca */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-nude-400" />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-nude-200 bg-white font-body text-sm text-nude-700 placeholder:text-nude-400 focus:outline-none focus:border-nude-400 transition-colors"
            />
          </div>

          {/* Categorias — desktop */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 font-body text-xs tracking-[0.15em] uppercase transition-all duration-200 ${
                !selectedCategory
                  ? 'bg-nude-800 text-cream'
                  : 'border border-nude-200 text-nude-600 hover:border-nude-400'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? '' : cat.id)}
                className={`px-4 py-2 font-body text-xs tracking-[0.15em] uppercase transition-all duration-200 ${
                  cat.id === selectedCategory
                    ? 'bg-nude-800 text-cream'
                    : 'border border-nude-200 text-nude-600 hover:border-nude-400'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Ordenação */}
          <div className="relative ml-auto">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-nude-200 bg-white font-body text-xs tracking-[0.1em] text-nude-600 focus:outline-none focus:border-nude-400 cursor-pointer"
            >
              <option value="default">Ordenar</option>
              <option value="name">Nome A–Z</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-nude-400 pointer-events-none" />
          </div>

          {/* Filtro mobile */}
          <button
            className="md:hidden flex items-center gap-2 border border-nude-200 px-4 py-2.5 font-body text-xs tracking-widest uppercase text-nude-600"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal size={14} /> Filtrar
          </button>
        </div>

        {/* Filtro mobile expandido */}
        {filterOpen && (
          <div className="md:hidden flex flex-wrap gap-2 mb-6 p-4 bg-white border border-nude-100">
            <button
              onClick={() => { setSelectedCategory(''); setFilterOpen(false) }}
              className={`px-4 py-2 font-body text-xs tracking-widest uppercase ${
                !selectedCategory ? 'bg-nude-800 text-cream' : 'border border-nude-200 text-nude-600'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id === selectedCategory ? '' : cat.id); setFilterOpen(false) }}
                className={`px-4 py-2 font-body text-xs tracking-widest uppercase ${
                  cat.id === selectedCategory ? 'bg-nude-800 text-cream' : 'border border-nude-200 text-nude-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Contagem + limpar */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-body text-xs text-nude-500 tracking-wide">
            {loading ? '...' : `${sorted.length} produto${sorted.length !== 1 ? 's' : ''}`}
          </p>
          {(selectedCategory || searchTerm) && (
            <button
              onClick={() => { setSelectedCategory(''); setSearchTerm('') }}
              className="flex items-center gap-1 font-body text-xs text-nude-500 hover:text-nude-700 transition-colors"
            >
              <X size={12} /> Limpar filtros
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-4xl mb-4 text-nude-300">✦</div>
            <p className="font-display text-2xl font-light text-nude-600 mb-2">
              Nenhum produto encontrado
            </p>
            <p className="font-body text-sm text-nude-400">
              Tente outros termos ou remova os filtros
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in">
            {sorted.map((product, i) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  categoryName: categories.find(c => c.id === product.categoryId)?.name,
                }}
                priority={i < 4}
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
