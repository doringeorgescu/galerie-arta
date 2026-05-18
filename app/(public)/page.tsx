import { prisma } from '@/lib/prisma'
import { MuseumCarousel } from '@/components/gallery/MuseumCarousel'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const paintings = await prisma.painting.findMany({
    where: { status: { in: ['AVAILABLE', 'RESERVED'] } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 mb-10 text-center">
        <h1 className="font-serif text-5xl text-ink mb-3">Galerie</h1>
        <p className="text-muted text-lg">Lucrări originale</p>
      </div>
      <MuseumCarousel paintings={paintings} />
      <div className="h-16" />
    </div>
  )
}
