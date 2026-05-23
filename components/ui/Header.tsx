'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { useCart } from '@/lib/cart-context'

const links = [
  { href: '/gallery', label: 'Galerie' },
  { href: '/about', label: 'Despre' },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { count, openCart } = useCart()

  // Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        router.push('/search')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return (
    <header className="border-b border-muted/30 bg-canvas/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-signature text-4xl leading-none select-none"
          style={{ color: 'var(--color-terra)' }}
        >
          Maria Cutinov
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8" aria-label="Navigare principală">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              className={clsx(
                'text-sm transition-colors',
                pathname === href ? 'text-accent font-medium' : 'text-muted hover:text-ink',
              )}
            >
              {label}
            </Link>
          ))}

          {/* Search icon */}
          <Link
            href="/search"
            aria-label="Caută (⌘K)"
            className="p-1.5 text-muted hover:text-ink transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </Link>

          {/* Cart icon */}
          <button
            onClick={openCart}
            aria-label={`Coș${count > 0 ? ` (${count})` : ''}`}
            className="relative p-1.5 text-muted hover:text-ink transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-accent)', minWidth: 14, height: 14, padding: '0 3px' }}
              >
                {count}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile: search icon + cart + hamburger */}
        <div className="flex sm:hidden items-center gap-1">
          <Link
            href="/search"
            aria-label="Caută"
            className="p-2 text-muted hover:text-ink transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </Link>
          <button
            onClick={openCart}
            aria-label={`Coș${count > 0 ? ` (${count})` : ''}`}
            className="relative p-2 text-muted hover:text-ink transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3A1 1 0 006 17h12M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {count > 0 && (
              <span
                className="absolute top-0.5 right-0.5 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-accent)', minWidth: 14, height: 14, padding: '0 3px' }}
              >
                {count}
              </span>
            )}
          </button>
          <button
            className="p-2 text-muted hover:text-ink transition-colors"
            aria-label={open ? 'Închide meniu' : 'Deschide meniu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="sm:hidden border-t border-muted/30 bg-canvas px-4 pb-4" aria-label="Meniu mobil">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={pathname === href ? 'page' : undefined}
              className={clsx(
                'block py-3 text-sm transition-colors',
                pathname === href ? 'text-accent font-medium' : 'text-muted hover:text-ink',
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
