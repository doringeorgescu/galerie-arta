'use client'

import { useCart } from '@/lib/cart-context'
import type { Painting } from '@/types'

export function AddToCartButton({
  painting,
  className,
  style,
}: {
  painting: Painting
  className?: string
  style?: React.CSSProperties
}) {
  const { isInCart, add, remove } = useCart()
  const inCart = isInCart(painting.id)

  if (painting.status !== 'AVAILABLE') return null

  function toggle() {
    if (inCart) {
      remove(painting.id)
    } else {
      add({
        id: painting.id,
        slug: painting.slug,
        title: painting.title,
        priceBani: painting.priceBani,
        imageUrl: painting.imageUrl,
      })
    }
  }

  return (
    <button
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle() }}
      className={className}
      style={style}
      aria-label={inCart ? `Elimină ${painting.title} din coș` : `Adaugă ${painting.title} în coș`}
    >
      {inCart ? 'Adăugat ✓' : 'Adaugă în coș'}
    </button>
  )
}
