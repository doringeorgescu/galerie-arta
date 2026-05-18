import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-muted/30 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>© {new Date().getFullYear()} Galerie Artă. Toate drepturile rezervate.</p>
        <nav className="flex gap-6" aria-label="Legal">
          <Link href="/legal/terms" className="hover:text-ink transition-colors">
            Termeni
          </Link>
          <Link href="/legal/privacy" className="hover:text-ink transition-colors">
            Confidențialitate
          </Link>
          <Link href="/legal/returns" className="hover:text-ink transition-colors">
            Retur
          </Link>
        </nav>
      </div>
    </footer>
  )
}
