'use client'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/ui/ProductCard'
import { Product, Category, Banner, SiteConfig } from '@/types'
import { MessageCircle, ArrowRight, Star, Shield, Truck, Sparkles } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

interface Props {
  featuredProducts: Product[]
  categories: Category[]
  banners: Banner[]
  config: SiteConfig
}

export default function HomeClient({ featuredProducts, categories, banners, config }: Props) {
  const productsWithCategory = featuredProducts.map(p => ({
    ...p, categoryName: categories.find(c => c.id === p.categoryId)?.name,
  }))

  return (
    <div className="min-h-screen bg-cream">
      <Header categories={categories} />

      {/* BANNER */}
      <section className="relative">
        {banners.length > 0 ? (
          <Swiper modules={[Autoplay, Pagination, Navigation]} autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }} navigation loop className="w-full">
            {banners.map(banner => (
              <SwiperSlide key={banner.id}>
                <div className="relative w-full bg-brown-100" style={{ aspectRatio: '21/9', minHeight: '320px' }}>
                  <Image src={banner.imageUrl} alt={banner.title || 'Banner'} fill className="object-cover" priority />
                  {(banner.title || banner.subtitle) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brown-900/60 to-transparent flex items-center">
                      <div className="text-white px-8 md:px-16 max-w-2xl">
                        {banner.title && <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider mb-4 drop-shadow-lg text-white">{banner.title}</h1>}
                        {banner.subtitle && <p className="font-body text-sm md:text-base tracking-[0.25em] uppercase opacity-90 mb-8 text-white/90">{banner.subtitle}</p>}
                        <Link href="/catalogo" className="btn-outline border-white text-white hover:bg-white hover:text-brown-900">Ver Coleção</Link>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative overflow-hidden bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900" style={{ minHeight: '420px' }}>
            {/* Padrão decorativo */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-96 h-96 rounded-full border border-white/20"
                  style={{ left: `${i * 15}%`, top: `${i % 2 === 0 ? -20 : 10}%` }} />
              ))}
            </div>
            <div className="relative flex items-center justify-center min-h-[420px] px-4">
              <div className="text-center">
                <p className="section-subtitle text-rose-light mb-4">Importados com cuidado</p>
                <h1 className="font-display text-5xl md:text-7xl font-light text-white tracking-wider mb-6">
                  O melhor do Brasil
                </h1>
                <p className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-white/60 mb-10">
                  Em Portugal
                </p>
                <Link href="/catalogo" className="btn-rose">Explorar Catálogo</Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* DIFERENCIAIS */}
      <section className="bg-white border-y border-brown-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: Truck, label: 'Entrega em Portugal' },
              { icon: Shield, label: 'Produtos Originais' },
              { icon: Star, label: 'Atendimento VIP' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 md:gap-3">
                <div className="w-7 h-7 bg-rose-pale rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-rose" />
                </div>
                <span className="font-body text-[10px] md:text-xs font-medium tracking-[0.1em] uppercase text-brown-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      {categories.length > 0 && (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle mb-3">Explore por</p>
            <h2 className="section-title">Categorias</h2>
            <div className="divider-rose mx-auto mt-5" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link key={cat.id} href={`/catalogo?categoria=${cat.slug}`}
                className="group relative bg-white hover:bg-rose-pale border border-brown-100 hover:border-rose-light rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-soft">
                <div className="w-10 h-10 bg-rose-pale group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Sparkles size={16} className="text-rose" />
                </div>
                <p className="font-body text-sm font-medium text-brown-800 group-hover:text-rose-dark tracking-wide">
                  {cat.name}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* DESTAQUES */}
      {productsWithCategory.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="section-subtitle mb-3">Mais Procurados</p>
                <h2 className="section-title">Destaques</h2>
                <div className="divider-rose mt-5" />
              </div>
              <Link href="/catalogo" className="hidden md:flex items-center gap-2 font-body text-xs tracking-[0.18em] uppercase text-brown-600 hover:text-brown-900 transition-colors font-medium">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {productsWithCategory.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/catalogo" className="btn-outline">Ver Catálogo Completo</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA WHATSAPP */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-brown-900 to-brown-800">
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="absolute w-96 h-96 rounded-full border border-rose/10"
              style={{ right: `-${i * 8}%`, bottom: `-${i * 10}%` }} />
          ))}
        </div>
        <div className="max-w-2xl mx-auto px-4 text-center relative">
          <div className="w-12 h-0.5 bg-rose mx-auto mb-8" />
          <h2 className="font-display text-4xl md:text-5xl font-light text-white tracking-wider mb-6">
            Precisa de ajuda para escolher?
          </h2>
          <p className="font-body text-sm text-white/60 leading-relaxed mb-10">
            A nossa equipa está pronta para orientar a sua compra e esclarecer todas as dúvidas.
          </p>
          <a href={`https://wa.me/${config.whatsappNumber?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full font-body text-sm tracking-[0.18em] uppercase font-medium hover:bg-[#20B858] transition-colors shadow-strong">
            <MessageCircle size={18} /> Falar pelo WhatsApp
          </a>
        </div>
      </section>

      <Footer whatsappNumber={config.whatsappNumber} storeName={config.storeName} instagramUrl={config.instagramUrl} />
    </div>
  )
}
