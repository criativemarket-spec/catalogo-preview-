// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'Brasil Premium — Produtos Brasileiros em Portugal',
    template: '%s | Brasil Premium',
  },
  description: 'Produtos importados do Brasil com qualidade e sofisticação. Cosméticos, perfumes, roupas e muito mais entregues em Portugal.',
  keywords: ['produtos brasileiros', 'importados brasil', 'cosméticos brasil', 'portugal'],
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    siteName: 'Brasil Premium',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <CartProvider>
          <FavoritesProvider>
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  background: '#2D1F14',
                  color: '#FBF7F2',
                  fontFamily: 'Jost, sans-serif',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  borderRadius: '0',
                  padding: '14px 20px',
                },
                success: { iconTheme: { primary: '#B8860B', secondary: '#FBF7F2' } },
              }}
            />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  )
}
