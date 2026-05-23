import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') ?? ''

  // ── Cart checkout (JSON body with paintingIds[]) ──
  if (contentType.includes('application/json')) {
    const body = await req.json()
    const paintingIds: string[] = body.paintingIds ?? []

    if (!paintingIds.length) {
      return NextResponse.json({ error: 'Coșul este gol.' }, { status: 400 })
    }

    const paintings = await prisma.painting.findMany({
      where: { id: { in: paintingIds }, status: 'AVAILABLE' },
    })

    if (!paintings.length) {
      return NextResponse.json({ error: 'Nicio lucrare disponibilă în coș.' }, { status: 400 })
    }

    const unavailable = paintingIds.filter(id => !paintings.find(p => p.id === id))
    if (unavailable.length) {
      const titles = paintings.filter(p => !paintingIds.includes(p.id)).map(p => p.title)
      return NextResponse.json(
        { error: `Unele lucrări nu mai sunt disponibile: ${titles.join(', ')}` },
        { status: 400 },
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'ron',
      line_items: paintings.map(p => ({
        price_data: {
          currency: 'ron',
          unit_amount: p.priceBani,
          product_data: { name: p.title, images: [p.imageUrl] },
        },
        quantity: 1,
      })),
      metadata: { paintingIds: paintings.map(p => p.id).join(',') },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    })

    return NextResponse.json({ url: session.url })
  }

  // ── Single painting checkout (form POST from BuyNowButton) ──
  const formData = await req.formData()
  const paintingId = formData.get('paintingId') as string

  if (!paintingId) {
    return NextResponse.json({ error: 'Missing paintingId' }, { status: 400 })
  }

  const painting = await prisma.painting.findUnique({ where: { id: paintingId } })

  if (!painting || painting.status !== 'AVAILABLE') {
    return NextResponse.json({ error: 'Lucrarea nu mai este disponibilă.' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'ron',
    line_items: [
      {
        price_data: {
          currency: 'ron',
          unit_amount: painting.priceBani,
          product_data: { name: painting.title, images: [painting.imageUrl] },
        },
        quantity: 1,
      },
    ],
    metadata: { paintingIds: painting.id },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/paintings/${painting.slug}`,
  })

  return NextResponse.redirect(session.url!, 303)
}
