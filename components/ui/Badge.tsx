import { clsx } from 'clsx'
import type { PaintingStatus } from '@/types'

const labels: Record<PaintingStatus, string> = {
  AVAILABLE: 'Disponibil',
  RESERVED: 'Rezervat',
  SOLD: 'Vândut',
}

const styles: Record<PaintingStatus, string> = {
  AVAILABLE: 'bg-emerald-100 text-emerald-800',
  RESERVED: 'bg-amber-100 text-amber-800',
  SOLD: 'bg-red-100 text-red-700',
}

export function Badge({ status }: { status: PaintingStatus }) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full px-3 py-0.5 text-xs font-medium tracking-wide',
        styles[status],
      )}
    >
      {labels[status]}
    </span>
  )
}
