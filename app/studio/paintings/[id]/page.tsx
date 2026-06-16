import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PaintingForm } from '@/components/admin/PaintingForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditPaintingPage({ params }: Props) {
  const { id } = await params
  const painting = await prisma.painting.findUnique({ where: { id } })
  if (!painting) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/studio/paintings" className="text-muted hover:text-ink text-sm transition-colors">
          ← Tablouri
        </Link>
        <h1 className="font-serif text-3xl text-ink">Editare lucrare</h1>
      </div>
      <PaintingForm painting={painting} />
    </div>
  )
}
