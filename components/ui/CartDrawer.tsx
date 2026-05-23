'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { formatPrice } from '@/lib/color'

export function CartDrawer() {
  const { items, isOpen, closeCart, remove, total } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  // Focus trap: focus close button when drawer opens
  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus()
  }, [isOpen])

  async function handleCheckout() {
    if (!items.length) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paintingIds: items.map(i => i.id) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Eroare la checkout.'); setLoading(false); return }
      window.location.href = data.url
    } catch {
      setError('Eroare de rețea. Încearcă din nou.')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
            onClick={closeCart}
            aria-hidden
          />

          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 38 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{
              width: 'min(420px, 100vw)',
              background: '#1A1410',
              borderLeft: '1px solid rgba(122,107,85,0.18)',
              boxShadow: '-12px 0 40px rgba(0,0,0,0.6)',
            }}
            role="dialog"
            aria-modal
            aria-label="Coș de cumpărături"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(122,107,85,0.15)' }}
            >
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-lg" style={{ color: 'var(--color-ink)' }}>Coș</h2>
                {items.length > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: 'var(--color-accent)',
                      color: '#fff',
                    }}
                  >
                    {items.length}
                  </span>
                )}
              </div>
              <button
                ref={closeBtnRef}
                onClick={closeCart}
                aria-label="Închide coș"
                className="p-2 transition-colors"
                style={{ color: 'var(--color-muted)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-ink)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
                  <svg
                    width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    style={{ color: 'rgba(122,107,85,0.35)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
                    />
                  </svg>
                  <p className="font-serif text-base" style={{ color: 'var(--color-muted)' }}>
                    Coșul tău este gol
                  </p>
                  <button
                    onClick={closeCart}
                    className="text-xs tracking-widest uppercase mt-2 transition-colors"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    Continuă explorarea →
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map(item => (
                    <li
                      key={item.id}
                      className="flex gap-4 items-start py-4"
                      style={{ borderBottom: '1px solid rgba(122,107,85,0.12)' }}
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/paintings/${item.slug}`}
                        onClick={closeCart}
                        className="shrink-0 block overflow-hidden rounded-sm"
                        style={{
                          width: 72, height: 72,
                          border: '1px solid rgba(122,107,85,0.2)',
                          background: '#0F0C09',
                        }}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/paintings/${item.slug}`}
                          onClick={closeCart}
                          className="block font-serif text-sm leading-snug truncate"
                          style={{ color: 'var(--color-ink)' }}
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm font-medium mt-1" style={{ color: 'var(--color-accent)' }}>
                          {formatPrice(item.priceBani)}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => remove(item.id)}
                        aria-label={`Elimină ${item.title}`}
                        className="shrink-0 p-1.5 transition-colors"
                        style={{ color: 'rgba(122,107,85,0.5)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(122,107,85,0.5)')}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="px-6 py-5 space-y-4"
                style={{ borderTop: '1px solid rgba(122,107,85,0.15)' }}
              >
                {error && (
                  <p className="text-xs text-center" style={{ color: 'var(--color-accent)' }}>
                    {error}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Total</span>
                  <span className="font-serif text-lg font-medium" style={{ color: 'var(--color-ink)' }}>
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3.5 text-sm tracking-widest uppercase font-medium transition-opacity"
                  style={{
                    background: loading ? 'rgba(192,80,80,0.5)' : 'var(--color-accent)',
                    color: '#fff',
                    borderRadius: 2,
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    border: 'none',
                  }}
                >
                  {loading ? 'Se procesează...' : 'Finalizează comanda'}
                </button>

                <p className="text-center text-xs" style={{ color: 'rgba(122,107,85,0.5)' }}>
                  Vei fi redirecționat către Stripe pentru plată securizată.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
