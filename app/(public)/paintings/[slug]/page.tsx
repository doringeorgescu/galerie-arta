import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

const getPainting = cache((slug: string) =>
  prisma.painting.findUnique({ where: { slug } })
)
import { PaintingGallery } from '@/components/gallery/PaintingGallery'
import { BuyNowButton } from '@/components/checkout/BuyNowButton'
import { AddToCartButton } from '@/components/gallery/AddToCartButton'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/color'

type Props = { params: Promise<{ slug: string }> }

type ExtraImage = { url: string; key: string }

function parseExtraImages(raw: unknown): ExtraImage[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (x): x is ExtraImage =>
      typeof x === 'object' && x !== null && typeof (x as ExtraImage).url === 'string',
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const painting = await getPainting(slug)
  if (!painting) return {}
  return {
    title: painting.title,
    description: painting.description,
    openGraph: { images: [{ url: painting.imageUrl }] },
  }
}

export default async function PaintingDetailPage({ params }: Props) {
  const { slug } = await params
  const painting = await getPainting(slug)

  if (!painting || painting.status === 'SOLD') notFound()

  // Adjacent paintings for prev/next navigation (skip SOLD)
  const [prevPainting, nextPainting] = await Promise.all([
    prisma.painting.findFirst({
      where: { status: { not: 'SOLD' }, createdAt: { lt: painting.createdAt } },
      orderBy: { createdAt: 'desc' },
      select: { slug: true, title: true },
    }),
    prisma.painting.findFirst({
      where: { status: { not: 'SOLD' }, createdAt: { gt: painting.createdAt } },
      orderBy: { createdAt: 'asc' },
      select: { slug: true, title: true },
    }),
  ])

  const extraImages = parseExtraImages(painting.extraImages)
  const galleryImages = [{ url: painting.imageUrl }, ...extraImages]

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image gallery */}
        <PaintingGallery
          images={galleryImages}
          title={painting.title}
          widthCm={painting.widthCm}
          heightCm={painting.heightCm}
          dominantColor={painting.dominantColor}
        />

        {/* Details */}
        <div className="space-y-6 md:sticky md:top-24">
          <div>
            <Badge status={painting.status} />
            <h1 className="font-serif text-4xl text-ink mt-3 leading-snug">{painting.title}</h1>
          </div>

          <p className="text-accent text-2xl font-medium">{formatPrice(painting.priceBani)}</p>

          <dl className="text-sm space-y-2 border-y border-muted/20 py-4">
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">Dimensiuni</dt>
              <dd className="text-ink">
                {painting.widthCm} × {painting.heightCm} cm
              </dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">Tehnică</dt>
              <dd className="text-ink">{painting.medium}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-24 shrink-0 text-muted">An</dt>
              <dd className="text-ink">{painting.year}</dd>
            </div>
          </dl>

          <p className="text-ink/80 leading-relaxed">{painting.description}</p>

          {painting.status === 'AVAILABLE' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <AddToCartButton
                painting={painting}
                className="flex-1 py-4 px-8 text-base tracking-widest uppercase font-medium transition-colors rounded-sm"
                style={{ background: 'var(--color-accent)', color: '#fff', border: 'none', cursor: 'pointer' }}
              />
              <BuyNowButton paintingId={painting.id} />
            </div>
          )}

          {painting.status === 'RESERVED' && (
            <p className="text-sm text-muted italic">
              Această lucrare este momentan rezervată.
            </p>
          )}
        </div>
      </div>

      {/* Prev / next painting navigation */}
      {(prevPainting || nextPainting) && (
        <nav
          className="flex justify-between items-center mt-16 pt-8 border-t border-muted/20"
          aria-label="Navigare tablouri"
        >
          {prevPainting ? (
            <Link
              href={`/paintings/${prevPainting.slug}`}
              className="group flex items-center gap-3 text-muted hover:text-ink transition-colors max-w-[45%]"
            >
              <svg
                width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                className="shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-serif text-sm truncate">{prevPainting.title}</span>
            </Link>
          ) : (
            <div />
          )}

          {nextPainting && (
            <Link
              href={`/paintings/${nextPainting.slug}`}
              className="group flex items-center gap-3 text-muted hover:text-ink transition-colors max-w-[45%] text-right"
            >
              <span className="font-serif text-sm truncate">{nextPainting.title}</span>
              <svg
                width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                className="shrink-0"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </nav>
      )}
    </section>
  )
}
