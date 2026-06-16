import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/color'
import { Badge } from '@/components/ui/Badge'
import { DeletePaintingButton } from '@/components/admin/DeletePaintingButton'

export const dynamic = 'force-dynamic'

export default async function PaintingsAdminPage() {
  const paintings = await prisma.painting.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Tablouri</h1>
        <Link
          href="/studio/paintings/new"
          className="bg-accent text-canvas rounded px-4 py-2 text-sm font-medium hover:bg-accent-light transition-colors"
        >
          + Lucrare nouă
        </Link>
      </div>

      {paintings.length === 0 ? (
        <p className="text-muted text-sm">Nicio lucrare. Adaugă prima.</p>
      ) : (
        <div className="space-y-2">
          {paintings.map((painting) => (
            <div
              key={painting.id}
              className="flex items-center justify-between p-4 bg-surface rounded border border-muted/20 gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-ink text-sm font-medium truncate">{painting.title}</p>
                <p className="text-muted text-xs mt-0.5">
                  {formatPrice(painting.priceBani)} · {painting.year} · {painting.medium}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <Badge status={painting.status} />
                <Link
                  href={`/studio/paintings/${painting.id}`}
                  className="text-xs text-muted hover:text-ink transition-colors"
                >
                  Editează
                </Link>
                <DeletePaintingButton id={painting.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
