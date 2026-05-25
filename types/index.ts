// types/index.ts

export interface Product {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  categoryName?: string
  images: string[]
  featured: boolean
  visible: boolean
  sku?: string
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface Category {
  id: string
  name: string
  slug: string
  order: number
  visible: boolean
  imageUrl?: string
}

export interface Banner {
  id: string
  imageUrl: string
  linkUrl?: string
  title?: string
  subtitle?: string
  active: boolean
  order: number
}

export interface SiteConfig {
  whatsappNumber: string
  storeName: string
  welcomeMessage: string
  logoUrl?: string
  primaryColor?: string
  instagramUrl?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderSummary {
  items: CartItem[]
  total: number
  formattedMessage: string
}
