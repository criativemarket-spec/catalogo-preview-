'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/context/CartContext'
import { getCategories } from '@/lib/categories'
import { getSiteConfig } from '@/lib/config'
import { Category, SiteConfig } from '@/types'
import { generateWhatsAppMessage, openWhatsApp, formatPrice } from '@/lib/whatsapp'
import { MessageCircle, Copy, Check, ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

export default function FinalizarPage() {
  const { items, total, clearCart } = useCart()
  const [categories, setCategories] = useState<Category[]>([])
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    Promise.all([getCategories(), getSiteConfig()]).then(([cats, cfg]) => {
      setCategories(cats)
      setConfig(cfg)
    })
  }, [])

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <ShoppingBag size={40} className="text-brown-300" />
        <p className="font-display text-2xl text-brown-600">Carrinho vazio</p>
        <Link href="/catalogo" className="btn-primary">Ir ao catálogo</Link>
      </div>
    )
  }

  const message = config ? generateWhatsAppMessage(items, config) : ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    toast.success('Pedido copiado!')
    setTimeout(() => setCopied(false), 3000)
  }

  const handleWhatsApp = () => {
    if (!config) return
    openWhatsApp(config.whatsappNumber, message)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header categories={categories} />

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <Link href="/carrinho" className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-brown-500 hover:text-brown-800 transition-colors mb-10">
          <ArrowLeft size={14} /> Voltar ao carrinho
        </Link>

        <div className="mb-10">
          <p className="section-subtitle mb-3">Quase lá</p>
          <h1 className="section-title">Finalizar Pedido</h1>
          <div className="divider-rose mt-5" />
        </div>

        {/* Card VIP resumo */}
        <div className="bg-white rounded-3xl border border-brown-100 shadow-soft overflow-hidden mb-6">
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-brown-900 to-brown-800 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose/20 rounded-full flex items-center justify-center">
              <Sparkles size={15} className="text-rose-light" />
            </div>
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50">Resumo do pedido</p>
              <p className="font-body text-sm text-white font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Itens */}
          <div className="p-6 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between items-start pb-4 border-b border-brown-100 last:border-0 last:pb-0">
                <div>
                  <p className="font-body text-sm font-medium text-brown-900">{item.product.name}</p>
                  <p className="font-body text-xs text-brown-400 mt-0.5">Quantidade: {item.quantity}</p>
                </div>
                <p className="font-body text-sm font-semibold text-brown-900">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Total VIP */}
          <div className="px-6 py-5 bg-rose-pale border-t border-rose-light/30">
            <div className="flex justify-between items-center">
              <p className="font-body text-sm font-semibold tracking-[0.1em] uppercase text-brown-700">Total</p>
              <p className="font-display text-3xl font-light text-brown-900">{formatPrice(total)}</p>
            </div>
          </div>
        </div>

        {/* Mensagem */}
        <div className="bg-white rounded-2xl border border-brown-100 p-6 mb-6">
          <p className="section-subtitle mb-4">Mensagem para WhatsApp</p>
          <pre className="font-body text-sm text-brown-700 whitespace-pre-wrap bg-cream rounded-xl p-4 leading-relaxed text-[13px]">
            {message}
          </pre>
        </div>

        {/* Ações */}
        <div className="space-y-3">
          <button onClick={handleWhatsApp}
            className="w-full bg-[#25D366] text-white flex items-center justify-center gap-3 px-8 py-4 rounded-full font-body text-sm tracking-[0.18em] uppercase font-medium hover:bg-[#20B858] transition-colors shadow-soft">
            <MessageCircle size={18} /> Enviar pelo WhatsApp
          </button>
          <button onClick={handleCopy} className="btn-outline w-full">
            {copied ? <><Check size={15} className="text-green-600" /> Copiado!</> : <><Copy size={15} /> Copiar pedido</>}
          </button>
        </div>

        <p className="font-body text-xs text-brown-400 text-center mt-6 leading-relaxed">
          Ao enviar pelo WhatsApp, você será redirecionada para a conversa com a mensagem preenchida automaticamente.
        </p>
      </div>

      {config && <Footer whatsappNumber={config.whatsappNumber} storeName={config.storeName} instagramUrl={config.instagramUrl} />}
    </div>
  )
}
