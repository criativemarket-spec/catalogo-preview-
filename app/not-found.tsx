// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <p className="font-body text-[10px] tracking-[0.5em] uppercase text-nude-400 mb-4">Erro 404</p>
      <h1 className="font-display text-6xl md:text-8xl font-light text-nude-800 mb-4">
        Página não encontrada
      </h1>
      <div className="h-px w-16 bg-[var(--color-gold)] mx-auto mb-8" />
      <p className="font-body text-sm text-nude-500 max-w-sm mb-10 leading-relaxed">
        A página que procura não existe ou foi movida. Explore o nosso catálogo.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="btn-primary">Ir para a Home</Link>
        <Link href="/catalogo" className="btn-outline">Ver Catálogo</Link>
      </div>
    </div>
  )
}
