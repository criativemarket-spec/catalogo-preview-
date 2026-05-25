'use client'
// app/produto/[id]/ProdutoClient.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/ui/ProductCard'
import { getProductById, getProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import { getSiteConfig } from '@/lib/config'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { Product, Category, SiteConfig } from '@/types'
import { formatPrice } from '@/lib/whatsapp'
import { Heart, ShoppingBag, Share2, Minus, Plus, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props { id: string }

export default function ProdutoClient({ id }: Props) {
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)

    getProductById(id)
      .then(prod => {
        setProduct(prod)
        if (!prod) { setLoading(false); return }
        // Buscar categorias e config em paralelo, sem bloquear
        Promise.all([getCategories(), getSiteConfig()])
          .then(([cats, cfg]) => {
            setCategories(cats)
            setConfig(cfg)
          })
          .catch(() => {})
          .finally(() => setLoading(false))
        // Buscar relacionados separadamente sem bloquear
        getProducts({ categoryId: prod.categoryId })
          .then(rel => setRelated(rel.filter(r => r.id !== prod.id).slice(0, 4)))
          .catch(() => {})
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-nude-200 border-t-nude-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-400">Carregando</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl text-nude-600">Produto não encontrado</p>
        <Link href="/catalogo" className="btn-primary">Voltar ao catálogo</Link>
      </div>
    )
  }

  const category = categories.find(c => c.id === product.categoryId)
  const fav = isFavorite(product.id)

  const handleAddCart = () => {
    addItem(product, quantity)
    toast.success(`${quantity}× ${product.name} adicionado`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copiado!')
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header categories={categories} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center gap-2 font-body text-xs text-nude-400 tracking-wide flex-wrap">
          <Link href="/" className="hover:text-nude-600 transition-colors">Início</Link>
          <ChevronRight size={12} />
          <Link href="/catalogo" className="hover:text-nude-600 transition-colors">Catálogo</Link>
          {category && (
            <>
              <ChevronRight size={12} />
              <Link href={`/catalogo?categoria=${category.slug}`} className="hover:text-nude-600 transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-nude-600 truncate max-w-[160px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {/* Galeria */}
          <div className="space-y-4">
            <div className="relative bg-nude-50 overflow-hidden" style={{ aspectRatio: '3/4' }}>
              {product.featured && <div className="badge-featured z-10">Destaque</div>}
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                  priority
                />
              ) : (
                <div className="w-full h-full bg-nude-100 flex items-center justify-center">
                  <span className="text-4xl text-nude-300">✦</span>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative flex-shrink-0 w-20 h-20 overflow-hidden transition-all duration-200 ${i === selectedImage ? 'ring-1 ring-nude-700' : 'opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {category && <p className="section-subtitle mb-3">{category.name}</p>}
            <h1 className="font-display text-3xl md:text-4xl font-light text-nude-900 leading-tight mb-4">
              {product.name}
            </h1>
            <div className="h-px w-12 bg-[#B8860B] mb-6" />
            <p className="font-body text-3xl font-light text-[#B8860B] mb-8">
              {formatPrice(product.price)}
            </p>
            {product.sku && (
              <p className="font-body text-xs text-nude-400 tracking-widest uppercase mb-5">
                Código: {product.sku}
              </p>
            )}
            {product.description && (
              <p className="font-body text-sm text-nude-600 leading-relaxed mb-8 whitespace-pre-line">
                {product.description}
              </p>
            )}

            {/* Quantidade */}
            <div className="flex items-center gap-4 mb-6">
              <p className="font-body text-xs tracking-[0.2em] uppercase text-nude-500">Quantidade</p>
              <div className="flex items-center border border-nude-200">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-nude-600 hover:text-nude-900">
                  <Minus size={14} />
                </button>
                <span className="px-5 py-2 font-body text-sm font-medium text-nude-800 border-x border-nude-200 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-nude-600 hover:text-nude-900">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button onClick={handleAddCart} className="btn-primary flex items-center justify-center gap-2 flex-1">
                <ShoppingBag size={15} /> Adicionar ao pedido
              </button>
              <button
                onClick={() => { toggleFavorite(product); toast.success(fav ? 'Removido dos favoritos' : 'Adicionado aos favoritos') }}
                className={`btn-outline flex items-center justify-center gap-2 ${fav ? 'border-rosegold-400 text-rosegold-500' : ''}`}
              >
                <Heart size={15} fill={fav ? 'currentColor' : 'none'} />
              </button>
              <button onClick={handleShare} className="btn-outline flex items-center justify-center gap-2 px-4">
                <Share2 size={15} />
              </button>
            </div>

            <Link href="/carrinho" className="font-body text-xs tracking-[0.2em] uppercase text-nude-500 hover:text-nude-700 transition-colors text-center">
              Ver carrinho →
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-10">
              <p className="section-subtitle mb-3">Você também pode gostar</p>
              <h2 className="section-title">Produtos Relacionados</h2>
              <div className="h-px w-12 bg-[#B8860B] mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={{ ...p, categoryName: category?.name }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {config && (
        <Footer whatsappNumber={config.whatsappNumber} storeName={config.storeName} instagramUrl={config.instagramUrl} />
      )}
    </div>
  )
}
