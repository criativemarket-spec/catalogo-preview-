// app/admin/loading.tsx
export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-nude-300 border-t-nude-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="font-body text-xs tracking-[0.3em] uppercase text-nude-400">Carregando</p>
      </div>
    </div>
  )
}
