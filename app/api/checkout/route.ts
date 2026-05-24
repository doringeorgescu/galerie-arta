import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'

function baseUrl() {
  // Prefer explicit env var; fall back to Vercel's injected deployment URL
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  )
}

function safeImages(url: string | null | undefined): string[] {
  if (url && url.startsWith('https://')) return [url]
  return []
}

export async function POST(req: NextRequest) {
  try {
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

    const totalBani = paintings.reduce((s, p) => s + p.priceBani, 0)
    if (totalBani < 300) {
      return NextResponse.json({ error: 'Suma totală este prea mică pentru procesare (minim ~3 RON).' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'ron',
      line_items: paintings.map(p => ({
        price_data: {
          currency: 'ron',
          unit_amount: p.priceBani,
          product_data: { name: p.title, images: safeImages(p.imageUrl) },
        },
        quantity: 1,
      })),
      metadata: { paintingIds: paintings.map(p => p.id).join(',') },
      success_url: `${baseUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl()}/`,
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

  if (painting.priceBani < 300) {
    return NextResponse.json({ error: 'Prețul lucrării este prea mic pentru procesare (minim ~3 RON).' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    currency: 'ron',
    line_items: [
      {
        price_data: {
          currency: 'ron',
          unit_amount: painting.priceBani,
          product_data: { name: painting.title, images: safeImages(painting.imageUrl) },
        },
        quantity: 1,
      },
    ],
    metadata: { paintingId: painting.id },
    success_url: `${baseUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl()}/paintings/${painting.slug}`,
  })

  return NextResponse.redirect(session.url!, 303)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[checkout] FULL ERROR:', msg)
    return NextResponse.json({ error: 'Eroare la procesarea plății. Încearcă din nou.' }, { status: 500 })
  }
}
