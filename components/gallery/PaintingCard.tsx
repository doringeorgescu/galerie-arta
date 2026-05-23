import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/color'
import { PaintingFrame } from './PaintingFrame'
import { AddToCartButton } from './AddToCartButton'
import type { Painting } from '@/types'

export function PaintingCard({ painting }: { painting: Painting }) {
  const glowColor = painting.dominantColor ?? '#C05050'

  return (
    <div className="relative group">
      {/* Glow blooms behind the card on hover */}
      <div
        aria-hidden
        className="absolute -inset-4 opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, ${glowColor}, transparent 65%)`,
        }}
      />

      <Link href={`/paintings/${painting.slug}`} className="relative block z-10">
        <PaintingFrame>
          <div
            className="relative overflow-hidden"
            style={{ aspectRatio: `${painting.widthCm} / ${painting.heightCm}` }}
          >
            <Image
              src={painting.imageUrl}
              alt={painting.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h2 className="font-serif text-white text-xl text-center leading-snug">
                {painting.title}
              </h2>
              <p className="text-accent font-medium text-sm">{formatPrice(painting.priceBani)}</p>
              <span className="text-xs text-white/60 tracking-wide">
                {painting.year} · {painting.medium}
              </span>
              <Badge status={painting.status} />
              <span className="text-xs text-white/70 border border-white/25 px-4 py-1.5 rounded-sm tracking-widest uppercase">
                Vezi detalii
              </span>
              <AddToCartButton
                painting={painting}
                className="text-xs px-4 py-1.5 rounded-sm tracking-widest uppercase font-medium transition-colors"
                style={{
                  background: 'var(--color-accent)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
        </PaintingFrame>

        <div className="pt-3 px-1 space-y-1">
          <h2 className="font-serif text-ink text-base leading-snug">{painting.title}</h2>
          <p className="text-accent font-medium text-sm">{formatPrice(painting.priceBani)}</p>
        </div>
      </Link>
    </div>
  )
}
