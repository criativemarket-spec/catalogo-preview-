'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { formatPrice } from '@/lib/whatsapp'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [hovered, setHovered] = useState(false)

  const fav = isFavorite(product.id)
  const mainImage = product.images?.[0] || ''
  const hoverImage = product.images?.[1] || mainImage

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} adicionado!`)
  }

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleFavorite(product)
    toast.success(fav ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
  }

  return (
    <Link href={`/produto/${product.id}`} className="product-card group block animate-fade-in">
      {/* Imagem */}
      <div className="relative overflow-hidden bg-brown-50 rounded-t-2xl"
        style={{ aspectRatio: '3/4' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>

        {product.featured && <div className="badge-featured">Destaque</div>}

        {mainImage ? (
          <>
            <Image src={mainImage} alt={product.name} fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-all duration-700 ${hovered && hoverImage !== mainImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
              priority={priority} unoptimized />
            {hoverImage !== mainImage && (
              <Image src={hoverImage} alt={product.name} fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className={`object-cover absolute inset-0 transition-all duration-700 ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                unoptimized />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brown-100">
            <span className="text-5xl text-brown-300">✦</span>
          </div>
        )}

        {/* Overlay */}
        <div className={`absolute inset-0 bg-brown-900/0 group-hover:bg-brown-900/10 transition-all duration-300`} />

        {/* Botões ação */}
        <div className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button onClick={handleFav}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-medium backdrop-blur-sm transition-all ${fav ? 'bg-rose text-white' : 'bg-white text-brown-700 hover:bg-rose-pale'}`}>
            <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <button onClick={handleAddCart}
            className="w-9 h-9 bg-brown-900 text-white rounded-full flex items-center justify-center hover:bg-brown-700 shadow-medium transition-all">
            <ShoppingBag size={14} />
          </button>
        </div>

        {/* Ver produto */}
        <div className={`absolute bottom-0 left-0 right-0 bg-brown-900/85 backdrop-blur-sm text-white text-[10px] tracking-[0.25em] uppercase font-body text-center py-3 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <span className="flex items-center justify-center gap-2"><Eye size={12} /> Ver produto</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-white rounded-b-2xl">
        {product.categoryName && (
          <p className="section-subtitle text-[9px] mb-1.5">{product.categoryName}</p>
        )}
        <h3 className="font-display text-base font-light text-brown-900 leading-tight mb-2 line-clamp-2 group-hover:text-brown-700 transition-colors">
          {product.name}
        </h3>
        <p className="price-tag">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
