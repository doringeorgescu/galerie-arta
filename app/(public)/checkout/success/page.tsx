import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  let paintingTitle: string | null = null

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      const paintingId = session.metadata?.paintingId
      if (paintingId) {
        const painting = await prisma.painting.findUnique({
          where: { id: paintingId },
          select: { title: true },
        })
        paintingTitle = painting?.title ?? null
      }
    } catch {
      // silently ignore — show generic success message
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-6">
        <div
          className="mx-auto w-12 h-12 rounded-full border border-accent/40 flex items-center justify-center"
          aria-hidden
        >
          <span className="text-accent text-xl">✓</span>
        </div>

        <h1 className="font-serif text-3xl text-ink">Mulțumim pentru achiziție!</h1>

        {paintingTitle && (
          <p className="text-muted">
            Lucrarea{' '}
            <span className="text-ink font-medium">&ldquo;{paintingTitle}&rdquo;</span> a
            fost achiziționată cu succes.
          </p>
        )}

        <p className="text-muted text-sm leading-relaxed">
          Vă vom contacta în curând pentru a stabili detaliile de ridicare a lucrării.
        </p>

        <Link
          href="/"
          className="inline-block text-xs text-muted hover:text-ink border border-muted/25 hover:border-muted/50 px-6 py-2 transition-colors tracking-widest uppercase"
        >
          ← Înapoi la galerie
        </Link>
      </div>
    </div>
  )
}
