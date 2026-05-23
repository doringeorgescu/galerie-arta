import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { MuseumLighting } from '@/components/gallery/MuseumLighting'
import { PaintingFrame } from '@/components/gallery/PaintingFrame'
import { BuyNowButton } from '@/components/checkout/BuyNowButton'
import { AddToCartButton } from '@/components/gallery/AddToCartButton'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/color'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const painting = await prisma.painting.findUnique({ where: { slug } })
  if (!painting) return {}
  return {
    title: painting.title,
    description: painting.description,
    openGraph: { images: [{ url: painting.imageUrl }] },
  }
}

export default async function PaintingDetailPage({ params }: Props) {
  const { slug } = await params
  const painting = await prisma.painting.findUnique({ where: { slug } })

  if (!painting || painting.status === 'SOLD') notFound()

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Image with museum glow */}
        <MuseumLighting dominantColor={painting.dominantColor}>
          <PaintingFrame>
            <Image
              src={painting.imageUrl}
              alt={painting.title}
              width={600}
              height={Math.round(600 * painting.heightCm / painting.widthCm)}
              className="w-full h-auto block"
              priority
            />
          </PaintingFrame>
        </MuseumLighting>

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
    </section>
  )
}
