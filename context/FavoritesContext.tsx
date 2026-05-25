'use client'
// context/FavoritesContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Product } from '@/types'

interface FavoritesContextType {
  favorites: Product[]
  addFavorite: (product: Product) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  toggleFavorite: (product: Product) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAV_KEY = 'bp_favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FAV_KEY)
      if (saved) setFavorites(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (product: Product) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === product.id)) return prev
      return [...prev, product]
    })
  }

  const removeFavorite = (productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId))
  }

  const isFavorite = (productId: string) =>
    favorites.some(p => p.id === productId)

  const toggleFavorite = (product: Product) => {
    isFavorite(product.id) ? removeFavorite(product.id) : addFavorite(product)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider')
  return ctx
}
