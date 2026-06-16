import Link from 'next/link'
import { PaintingForm } from '@/components/admin/PaintingForm'

export default function NewPaintingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/studio/paintings" className="text-muted hover:text-ink text-sm transition-colors">
          ← Tablouri
        </Link>
        <h1 className="font-serif text-3xl text-ink">Lucrare nouă</h1>
      </div>
      <PaintingForm />
    </div>
  )
}
