import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Single painting checkout stores `paintingId`; cart checkout stores `paintingIds` (comma-separated)
    const singleId = session.metadata?.paintingId
    const multiIds = session.metadata?.paintingIds?.split(',').filter(Boolean) ?? []
    const paintingIds = singleId ? [singleId] : multiIds

    if (paintingIds.length > 0) {
      try {
        await prisma.$transaction(
          paintingIds.map(id =>
            prisma.painting.update({ where: { id }, data: { status: 'SOLD' } })
          )
        )

        for (const paintingId of paintingIds) {
          await prisma.order.create({
            data: {
              paintingId,
              // For cart sessions, append paintingId to keep stripeSessionId unique per row
              stripeSessionId: paintingIds.length > 1
                ? `${session.id}-${paintingId}`
                : session.id,
              stripePaymentIntentId: typeof session.payment_intent === 'string'
                ? session.payment_intent
                : null,
              status: 'PAID',
              customerEmail: session.customer_details?.email ?? '',
              customerName: session.customer_details?.name ?? '',
              amountPaidBani: session.amount_total ?? 0,
            },
          })
        }
      } catch (err: unknown) {
        // Duplicate webhook (idempotency) — P2002 = unique constraint violation on stripeSessionId
        if ((err as { code?: string }).code === 'P2002') {
          return NextResponse.json({ received: true })
        }
        throw err
      }
    }
  }

  return NextResponse.json({ received: true })
}
