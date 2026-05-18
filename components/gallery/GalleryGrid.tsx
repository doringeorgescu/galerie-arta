import { PaintingCard } from './PaintingCard'
import type { Painting } from '@/types'

export function GalleryGrid({ paintings }: { paintings: Painting[] }) {
  if (paintings.length === 0) {
    return (
      <div className="text-center py-24 text-muted">
        <p className="text-lg font-serif">Nicio lucrare disponibilă momentan.</p>
        <p className="text-sm mt-2">Reveniți curând.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {paintings.map((painting) => (
        <PaintingCard key={painting.id} painting={painting} />
      ))}
    </div>
  )
}
