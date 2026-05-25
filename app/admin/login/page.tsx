'use client'
// app/admin/login/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Eye, EyeOff, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.replace('/admin')
    } catch (err: any) {
      setError('E-mail ou senha inválidos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-nude-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl font-light text-nude-800 tracking-wider">
            Brasil Premium
          </h1>
          <div className="h-px w-12 bg-[var(--color-gold)] mx-auto mt-3 mb-2" />
          <p className="font-body text-xs tracking-[0.4em] uppercase text-nude-500">
            Painel Administrativo
          </p>
        </div>

        <div className="bg-white p-8 md:p-10">
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-nude-100 flex items-center justify-center">
              <Lock size={20} className="text-nude-600" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="label-admin">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-admin"
                placeholder="admin@brasилpremium.pt"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label-admin">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-admin pr-12"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-nude-400 hover:text-nude-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="font-body text-xs text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="font-body text-xs text-nude-400 hover:text-nude-600 transition-colors tracking-widest uppercase">
            ← Voltar ao site
          </a>
        </p>
      </div>
    </div>
  )
}
