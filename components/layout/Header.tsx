'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useFavorites } from '@/context/FavoritesContext'
import { Search, ShoppingBag, Heart, Menu, X } from 'lucide-react'
import { Category } from '@/types'

interface HeaderProps { categories?: Category[] }

export default function Header({ categories = [] }: HeaderProps) {
  const { totalItems } = useCart()
  const { favorites } = useFavorites()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      {/* Barra anúncio */}
      <div className="bg-[#2C1810] text-white/90 text-[10px] tracking-[0.3em] uppercase font-body text-center py-2.5 px-4">
        Frete fixo €25 — Grátis acima de €120 | Enviamos para a Europa
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/96 backdrop-blur-md shadow-soft border-b border-brown-100' : 'bg-cream'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Menu mobile */}
            <button className="md:hidden p-2 text-brown-700" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-1 md:flex-none flex justify-center md:justify-start">
              <div className="text-center md:text-left">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl md:text-3xl font-light tracking-[0.1em] text-brown-900">Brasil</span>
                  <span className="font-display text-2xl md:text-3xl font-light tracking-[0.1em] text-rose">Premium</span>
                </div>
                <p className="font-body text-[8px] tracking-[0.45em] uppercase text-brown-400 mt-0.5">Produtos Brasileiros</p>
              </div>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/catalogo" className="font-body text-xs tracking-[0.18em] uppercase text-brown-700 hover:text-brown-900 transition-colors font-medium">
                Catálogo
              </Link>
              {categories.slice(0, 4).map(cat => (
                <Link key={cat.id} href={`/catalogo?categoria=${cat.slug}`}
                  className="font-body text-xs tracking-[0.18em] uppercase text-brown-600 hover:text-brown-900 transition-colors">
                  {cat.name}
                </Link>
              ))}
            </nav>

            {/* Ações */}
            <div className="flex items-center gap-1 md:gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-brown-600 hover:text-brown-900 hover:bg-brown-100 rounded-full transition-all">
                <Search size={18} />
              </button>
              <Link href="/favoritos" className="p-2.5 text-brown-600 hover:text-brown-900 hover:bg-brown-100 rounded-full transition-all relative">
                <Heart size={18} />
                {favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link href="/carrinho" className="p-2.5 text-brown-600 hover:text-brown-900 hover:bg-brown-100 rounded-full transition-all relative">
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brown-900 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Busca */}
          {searchOpen && (
            <div className="border-t border-brown-100 py-4 animate-fade-in-up">
              <form onSubmit={(e) => { e.preventDefault(); if (searchTerm.trim()) window.location.href = `/catalogo?busca=${encodeURIComponent(searchTerm)}` }}
                className="flex items-center gap-3 max-w-xl mx-auto">
                <Search size={16} className="text-brown-400 flex-shrink-0" />
                <input autoFocus type="text" placeholder="O que está procurando?"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="input-premium flex-1" />
                <button type="submit" className="btn-primary py-2 px-5 text-[10px]">Buscar</button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setMenuOpen(false)}>
          <div className="absolute top-0 left-0 h-full w-72 bg-cream shadow-drawer" onClick={e => e.stopPropagation()}>
            <div className="p-8 pt-12">
              <p className="section-subtitle mb-6">Menu</p>
              <nav className="flex flex-col gap-4">
                <Link href="/catalogo" className="font-display text-2xl font-light text-brown-900" onClick={() => setMenuOpen(false)}>Catálogo</Link>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/catalogo?categoria=${cat.slug}`}
                    className="font-display text-xl font-light text-brown-700 hover:text-brown-900"
                    onClick={() => setMenuOpen(false)}>{cat.name}</Link>
                ))}
                <hr className="border-brown-200 my-2" />
                <Link href="/favoritos" className="flex items-center gap-2 font-body text-sm text-brown-600 hover:text-brown-900" onClick={() => setMenuOpen(false)}>
                  <Heart size={14} /> Favoritos
                </Link>
                <Link href="/carrinho" className="flex items-center gap-2 font-body text-sm text-brown-600 hover:text-brown-900" onClick={() => setMenuOpen(false)}>
                  <ShoppingBag size={14} /> Carrinho
                </Link>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
