import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/color'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'

export const dynamic = 'force-dynamic'

const statusLabel = { PENDING: 'În așteptare', PAID: 'Plătită', SHIPPED: 'Predată' }
const statusColor = {
  PENDING: 'text-amber-400',
  PAID: 'text-emerald-400',
  SHIPPED: 'text-sky-400',
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: { painting: { select: { title: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-ink">Comenzi</h1>
        <span className="text-muted text-sm">{orders.length} total</span>
      </div>

      {orders.length === 0 ? (
        <p className="text-muted text-sm">Nu există comenzi încă.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-muted/20">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-muted/20">
              <tr>
                <th className="text-left px-4 py-3 text-muted font-medium text-xs uppercase tracking-widest">Data</th>
                <th className="text-left px-4 py-3 text-muted font-medium text-xs uppercase tracking-widest">Client</th>
                <th className="text-left px-4 py-3 text-muted font-medium text-xs uppercase tracking-widest">Tablou</th>
                <th className="text-right px-4 py-3 text-muted font-medium text-xs uppercase tracking-widest">Sumă</th>
                <th className="text-left px-4 py-3 text-muted font-medium text-xs uppercase tracking-widest">Status</th>
                <th className="text-left px-4 py-3 text-muted font-medium text-xs uppercase tracking-widest">Stripe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted/10">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {order.createdAt.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-ink font-medium">{order.customerName}</p>
                    <p className="text-muted text-xs">{order.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-ink">{order.painting.title}</td>
                  <td className="px-4 py-3 text-right text-ink font-medium whitespace-nowrap">
                    {formatPrice(order.amountPaidBani)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect id={order.id} status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`https://dashboard.stripe.com/test/payments/${order.stripePaymentIntentId ?? ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted text-xs font-mono hover:text-accent transition-colors truncate block max-w-[120px]"
                      title={order.stripeSessionId}
                    >
                      {order.stripeSessionId.slice(-12)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
