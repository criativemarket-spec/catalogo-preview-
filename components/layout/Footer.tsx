'use client'
import Link from 'next/link'
import { MessageCircle, Instagram, Heart } from 'lucide-react'

interface FooterProps {
  whatsappNumber?: string
  storeName?: string
  instagramUrl?: string
}

export default function Footer({ whatsappNumber = '351900000000', storeName = 'Brasil Premium', instagramUrl }: FooterProps) {
  return (
    <>
      <footer className="bg-brown-900 text-white">
        {/* Faixa rosé */}
        <div className="h-1 bg-gradient-to-r from-rose-dark via-rose to-rose-light" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-display text-2xl font-light text-white tracking-wider">Brasil</span>
                <span className="font-display text-2xl font-light text-rose-light tracking-wider">Premium</span>
              </div>
              <div className="w-10 h-0.5 bg-rose mb-5" />
              <p className="font-body text-sm text-white/60 leading-relaxed">
                Produtos importados do Brasil com qualidade e sofisticação, entregues em Portugal e Bélgica.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="section-subtitle text-white/40 mb-5">Navegação</p>
              <nav className="flex flex-col gap-3">
                {[{href:'/',label:'Início'},{href:'/catalogo',label:'Catálogo'},{href:'/favoritos',label:'Favoritos'},{href:'/carrinho',label:'Carrinho'}].map(item => (
                  <Link key={item.href} href={item.href} className="font-body text-sm text-white/60 hover:text-white transition-colors tracking-wide">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contato */}
            <div>
              <p className="section-subtitle text-white/40 mb-5">Contato</p>
              <div className="flex flex-col gap-3">
                <a href={`https://wa.me/${whatsappNumber.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 font-body text-sm text-white/60 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-[#25D366]/20 rounded-full flex items-center justify-center">
                    <MessageCircle size={15} className="text-[#25D366]" />
                  </div>
                  Falar pelo WhatsApp
                </a>
                {instagramUrl && (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 font-body text-sm text-white/60 hover:text-white transition-colors">
                    <div className="w-8 h-8 bg-rose/20 rounded-full flex items-center justify-center">
                      <Instagram size={15} className="text-rose-light" />
                    </div>
                    Instagram
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/30 tracking-widest">
              © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
            </p>
            <p className="font-body text-xs text-white/20 flex items-center gap-1">
              Feito com <Heart size={10} className="text-rose/60" fill="currentColor" /> para mulheres que amam o Brasil
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp flutuante */}
      <a href={`https://wa.me/${whatsappNumber.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-strong hover:scale-110 hover:shadow-rose transition-all duration-200"
        aria-label="WhatsApp">
        <MessageCircle size={26} fill="white" />
      </a>
    </>
  )
}
