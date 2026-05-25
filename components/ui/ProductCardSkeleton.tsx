export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-brown-100 shadow-soft">
      <div className="skeleton rounded-t-2xl" style={{ aspectRatio: '3/4' }} />
      <div className="p-4 bg-white rounded-b-2xl">
        <div className="skeleton h-2 w-14 mb-2 rounded-full" />
        <div className="skeleton h-4 w-3/4 mb-2 rounded-full" />
        <div className="skeleton h-3.5 w-20 rounded-full" />
      </div>
    </div>
  )
}
