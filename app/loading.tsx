// app/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-nude-200 border-t-nude-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-400">Carregando</p>
      </div>
    </div>
  )
}
