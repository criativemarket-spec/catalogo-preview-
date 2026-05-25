'use client'
// app/admin/layout.tsx
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { LayoutDashboard, Package, Tag, Image, Settings, LogOut, ChevronRight, Menu, X } from 'lucide-react'
import { signOut } from 'firebase/auth'

const NAV = [
  { href: '/admin', label: 'Painel', icon: LayoutDashboard },
  { href: '/admin/produtos', label: 'Produtos', icon: Package },
  { href: '/admin/categorias', label: 'Categorias', icon: Tag },
  { href: '/admin/banners', label: 'Banners', icon: Image },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
      setLoading(false)
    })
    return unsub
  }, [pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-nude-300 border-t-nude-700 rounded-full animate-spin" />
      </div>
    )
  }

  if (pathname === '/admin/login') return <>{children}</>

  const handleLogout = async () => {
    await signOut(auth)
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen bg-nude-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-nude-800 flex flex-col transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-nude-700">
          <p className="font-display text-lg font-light text-cream tracking-wider">Brasil Premium</p>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/40 mt-0.5">Painel Admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-body text-xs tracking-[0.15em] uppercase transition-all duration-200 ${
                  active
                    ? 'bg-[var(--color-gold)] text-white'
                    : 'text-cream/60 hover:text-cream hover:bg-nude-700'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-nude-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 font-body text-xs tracking-[0.15em] uppercase text-cream/40 hover:text-cream transition-colors w-full"
          >
            <LogOut size={15} /> Sair
          </button>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 font-body text-xs tracking-[0.15em] uppercase text-cream/40 hover:text-cream transition-colors mt-1">
            Ver site <ChevronRight size={13} />
          </Link>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Conteúdo */}
      <div className="flex-1 md:ml-60 flex flex-col">
        {/* Topbar mobile */}
        <div className="md:hidden flex items-center justify-between px-4 h-14 bg-white border-b border-nude-100 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-nude-700">
            <Menu size={20} />
          </button>
          <p className="font-display text-lg text-nude-800">Admin</p>
          <div className="w-9" />
        </div>

        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
