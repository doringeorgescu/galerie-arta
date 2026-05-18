import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const [available, reserved, sold] = await Promise.all([
    prisma.painting.count({ where: { status: 'AVAILABLE' } }),
    prisma.painting.count({ where: { status: 'RESERVED' } }),
    prisma.painting.count({ where: { status: 'SOLD' } }),
  ])

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl text-ink">Panou de control</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded border border-muted/20 p-6">
          <p className="text-muted text-xs uppercase tracking-widest mb-2">Disponibile</p>
          <p className="font-serif text-4xl text-emerald-400">{available}</p>
        </div>
        <div className="bg-surface rounded border border-muted/20 p-6">
          <p className="text-muted text-xs uppercase tracking-widest mb-2">Rezervate</p>
          <p className="font-serif text-4xl text-amber-400">{reserved}</p>
        </div>
        <div className="bg-surface rounded border border-muted/20 p-6">
          <p className="text-muted text-xs uppercase tracking-widest mb-2">Vândute</p>
          <p className="font-serif text-4xl text-red-400">{sold}</p>
        </div>
      </div>

      <Link
        href="/admin/paintings/new"
        className="inline-flex items-center gap-2 bg-accent text-canvas rounded px-5 py-2.5 text-sm font-medium hover:bg-accent-light transition-colors"
      >
        + Lucrare nouă
      </Link>
    </div>
  )
}
