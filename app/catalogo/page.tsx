// app/catalogo/page.tsx
import { Suspense } from 'react'
import CatalogoClient from './CatalogoClient'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton'

export const metadata = {
  title: 'Catálogo — Brasil Premium',
  description: 'Explore todos os produtos importados do Brasil disponíveis em Portugal.',
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    }>
      <CatalogoClient />
    </Suspense>
  )
}
