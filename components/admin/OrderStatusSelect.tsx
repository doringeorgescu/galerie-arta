'use client'

import { useTransition } from 'react'
import { updateOrderStatus } from '@/app/admin/actions'

type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED'

const labels: Record<OrderStatus, string> = {
  PENDING: 'În așteptare',
  PAID: 'Plătită',
  SHIPPED: 'Predată',
}

const colors: Record<OrderStatus, string> = {
  PENDING: 'text-amber-400',
  PAID: 'text-emerald-400',
  SHIPPED: 'text-sky-400',
}

export default function OrderStatusSelect({ id, status }: { id: string; status: OrderStatus }) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as OrderStatus
    startTransition(() => { updateOrderStatus(id, next) })
  }

  return (
    <select
      defaultValue={status}
      onChange={handleChange}
      disabled={isPending}
      className={`bg-surface border border-muted/30 rounded px-2 py-1 text-xs font-medium cursor-pointer disabled:opacity-50 ${colors[status]}`}
    >
      {(Object.keys(labels) as OrderStatus[]).map(s => (
        <option key={s} value={s} className="text-ink bg-surface">
          {labels[s]}
        </option>
      ))}
    </select>
  )
}
