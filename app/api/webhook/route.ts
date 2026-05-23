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
    const paintingId = session.metadata?.paintingId

    if (paintingId) {
      try {
        await prisma.$transaction([
          prisma.painting.update({
            where: { id: paintingId },
            data: { status: 'SOLD' },
          }),
          prisma.order.create({
            data: {
              paintingId,
              stripeSessionId: session.id,
              stripePaymentIntentId: typeof session.payment_intent === 'string'
                ? session.payment_intent
                : null,
              status: 'PAID',
              customerEmail: session.customer_details?.email ?? '',
              customerName: session.customer_details?.name ?? '',
              amountPaidBani: session.amount_total ?? 0,
            },
          }),
        ])
      } catch (err: unknown) {
        // Duplicate webhook (idempotency) — P2002 = unique constraint violation
        if ((err as { code?: string }).code === 'P2002') {
          return NextResponse.json({ received: true })
        }
        throw err
      }
    }
  }

  return NextResponse.json({ received: true })
}
