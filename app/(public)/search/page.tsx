import { prisma } from '@/lib/prisma'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { SearchInput } from '@/components/gallery/SearchInput'
import type { PaintingStatus } from '@/types'

type Props = { searchParams: Promise<{ q?: string; status?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', status } = await searchParams

  const validStatuses: PaintingStatus[] = ['AVAILABLE', 'RESERVED', 'SOLD']
  const statusFilter = validStatuses.includes(status as PaintingStatus)
    ? (status as PaintingStatus)
    : undefined

  const paintings = await prisma.painting.findMany({
    where: {
      AND: [
        statusFilter ? { status: statusFilter } : {},
        q.trim()
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { medium: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SearchInput initialQuery={q} initialStatus={status ?? ''} />

      <div className="mt-10">
        {(q.trim() || statusFilter) && (
          <p className="text-sm mb-8" style={{ color: 'var(--color-muted)' }}>
            <span style={{ color: 'var(--color-ink)', fontWeight: 500 }}>{paintings.length}</span>{' '}
            {paintings.length === 1 ? 'rezultat' : 'rezultate'}
            {q.trim() ? (
              <>
                {' '}pentru{' '}
                <span style={{ color: 'var(--color-ink)', fontWeight: 500 }}>„{q.trim()}"</span>
              </>
            ) : null}
          </p>
        )}
        <GalleryGrid paintings={paintings} />
      </div>
    </div>
  )
}
