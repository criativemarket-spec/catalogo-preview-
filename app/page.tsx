// app/page.tsx
import { Suspense } from 'react'
import { Metadata } from 'next'
import HomeClient from './HomeClient'
import { getProducts } from '@/lib/products'
import { getCategories } from '@/lib/categories'
import { getBanners, getSiteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Brasil Premium — Produtos Brasileiros em Portugal',
}

export default async function HomePage() {
  const [products, categories, banners, config] = await Promise.all([
    getProducts({ featured: true, limitCount: 8 }),
    getCategories(),
    getBanners(),
    getSiteConfig(),
  ])

  return (
    <HomeClient
      featuredProducts={products}
      categories={categories}
      banners={banners}
      config={config}
    />
  )
}
