import { prisma } from '@/lib/prisma'
import { MuseumCarousel } from '@/components/gallery/MuseumCarousel'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const paintings = await prisma.painting.findMany({
    where: { status: { in: ['AVAILABLE', 'RESERVED'] } },
    orderBy: { createdAt: 'desc' },
  })

  return <MuseumCarousel paintings={paintings} />
}
