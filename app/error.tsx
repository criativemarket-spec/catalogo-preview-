'use client'
// app/error.tsx
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <p className="font-body text-[10px] tracking-[0.5em] uppercase text-nude-400 mb-4">Algo correu mal</p>
      <h1 className="font-display text-4xl md:text-5xl font-light text-nude-800 mb-4">
        Erro inesperado
      </h1>
      <div className="h-px w-16 bg-[var(--color-gold)] mx-auto mb-8" />
      <p className="font-body text-sm text-nude-500 mb-10">
        Ocorreu um erro. Tente novamente ou volte ao início.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={reset} className="btn-primary">Tentar novamente</button>
        <Link href="/" className="btn-outline">Voltar à Home</Link>
      </div>
    </div>
  )
}
