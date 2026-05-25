'use client'
// app/carrinho/page.tsx
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/context/CartContext'
import { getCategories } from '@/lib/categories'
import { getSiteConfig } from '@/lib/config'
import { Category, SiteConfig } from '@/types'
import { formatPrice } from '@/lib/whatsapp'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, total } = useCart()
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

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="mb-10">
          <p className="section-subtitle mb-3">Minha lista</p>
          <h1 className="section-title">Carrinho</h1>
          <div className="h-px w-12 bg-[var(--color-gold)] mt-4" />
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-white">
            <ShoppingBag size={40} className="text-nude-200 mx-auto mb-4" />
            <p className="font-display text-2xl font-light text-nude-600 mb-2">
              O seu carrinho está vazio
            </p>
            <p className="font-body text-sm text-nude-400 mb-8">
              Adicione produtos para montar o seu pedido
            </p>
            <Link href="/catalogo" className="btn-primary">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de itens */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.product.id} className="bg-white flex gap-4 p-4 md:p-5">
                  {/* Imagem */}
                  <Link href={`/produto/${item.product.id}`}>
                    <div className="relative w-20 h-24 md:w-24 md:h-28 flex-shrink-0 bg-nude-50 overflow-hidden">
                      <Image
                        src={item.product.images?.[0] || '/placeholder.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/produto/${item.product.id}`}>
                        <h3 className="font-display text-lg font-light text-nude-900 hover:text-nude-700 transition-colors leading-tight">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.product.sku && (
                        <p className="font-body text-[10px] text-nude-400 tracking-widest uppercase mt-1">
                          Cód: {item.product.sku}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantidade */}
                      <div className="flex items-center border border-nude-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2.5 py-1.5 text-nude-500 hover:text-nude-800 transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1.5 font-body text-sm text-nude-800 border-x border-nude-200 min-w-10 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1.5 text-nude-500 hover:text-nude-800 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-body text-sm font-medium text-[var(--color-gold)]">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-nude-300 hover:text-rosegold-400 transition-colors"
                          aria-label="Remover"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 sticky top-24">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-500 mb-5">
                  Resumo do Pedido
                </p>

                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.product.id} className="flex justify-between font-body text-sm text-nude-600">
                      <span className="truncate max-w-32">{item.product.name} ×{item.quantity}</span>
                      <span>{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-nude-100 pt-4 flex justify-between items-center mb-6">
                  <p className="font-body text-sm tracking-[0.1em] uppercase text-nude-700">Total</p>
                  <p className="font-display text-2xl font-light text-[var(--color-gold)]">
                    {formatPrice(total)}
                  </p>
                </div>

                <p className="font-body text-xs text-nude-400 text-center mb-5">
                  * Os valores são em Euro (€). O pagamento é combinado diretamente via WhatsApp.
                </p>

                <Link
                  href="/finalizar"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  Finalizar Pedido <ArrowRight size={15} />
                </Link>

                <Link
                  href="/catalogo"
                  className="btn-outline w-full flex items-center justify-center gap-2 mt-3"
                >
                  Continuar Comprando
                </Link>
              </div>
            </div>
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
