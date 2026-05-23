import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactați-mă pentru comenzi speciale, întrebări sau colaborări.',
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-start gap-5 py-6 border-b" style={{ borderColor: 'rgba(122,107,85,0.2)' }}>
      <div
        className="mt-0.5 w-9 h-9 flex items-center justify-center rounded-sm shrink-0"
        style={{ background: 'rgba(196,114,75,0.12)', color: 'var(--color-terra)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs tracking-[0.25em] uppercase mb-1" style={{ color: 'var(--color-muted)' }}>
          {label}
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-serif text-lg transition-colors hover:text-terra"
            style={{ color: 'var(--color-ink)' }}
          >
            {value}
          </a>
        ) : (
          <p className="font-serif text-lg" style={{ color: 'var(--color-ink)' }}>
            {value}
          </p>
        )}
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-20">
      {/* Header */}
      <div className="mb-14">
        <p
          className="text-xs tracking-[0.35em] uppercase mb-4"
          style={{ color: 'var(--color-muted)' }}
        >
          Ia legătura
        </p>
        <h1
          className="font-signature leading-none"
          style={{ fontSize: 'clamp(3.5rem, 8vw, 5.5rem)', color: 'var(--color-terra)' }}
        >
          Contact
        </h1>
        <p className="mt-4 leading-relaxed" style={{ color: 'rgba(237,232,222,0.55)' }}>
          Pentru comenzi personalizate, întrebări despre lucrări sau orice altceva —
          nu ezitați să mă contactați.
        </p>
      </div>

      {/* Contact rows */}
      <div>
        <ContactRow
          label="Instagram"
          value="@mariacutinov"
          href="https://www.instagram.com/mariacutinov"
          icon={
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          }
        />
        <ContactRow
          label="Email"
          value="contact@mariacutinov.ro"
          href="mailto:contact@mariacutinov.ro"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <ContactRow
          label="Atelier"
          value="România"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <ContactRow
          label="Disponibilitate comenzi"
          value="Lucrări personalizate la cerere"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          }
        />
      </div>

      <p
        className="mt-10 text-sm italic"
        style={{ color: 'rgba(122,107,85,0.6)' }}
      >
        * Informațiile de contact vor fi completate în curând.
      </p>
    </section>
  )
}
