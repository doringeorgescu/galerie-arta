'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { clsx } from 'clsx'

const links = [
  { href: '/', label: 'Galerie' },
  { href: '/about', label: 'Despre' },
]

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-muted/30 bg-canvas/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-ink tracking-wide">
          Galerie Artă
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-8" aria-label="Navigare principală">
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
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 text-muted hover:text-ink transition-colors"
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
