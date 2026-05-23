import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Atmospheric paint wash background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full blur-[140px]"
          style={{
            width: '55vw', height: '45vw',
            top: '15%', left: '10%',
            background: 'radial-gradient(ellipse, rgba(196,114,75,0.18), transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: '40vw', height: '55vw',
            bottom: '10%', right: '8%',
            background: 'radial-gradient(ellipse, rgba(192,80,80,0.14), transparent 70%)',
          }}
        />
        <div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: '60vw', height: '30vw',
            top: '55%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(122,107,85,0.10), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(19,16,12,0.7) 100%)',
          }}
        />
      </div>

      {/* Decorative brush-stroke line above name */}
      <div aria-hidden className="relative mb-6">
        <svg viewBox="0 0 260 18" className="w-52 opacity-30" fill="none">
          <path
            d="M4,9 C30,3 60,15 90,9 S140,3 170,9 S220,15 256,9"
            stroke="#C4724B" strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative text-center px-6 space-y-6 max-w-2xl">
        <p
          className="text-xs tracking-[0.4em] uppercase"
          style={{ color: 'var(--color-muted)' }}
        >
          Artă Originală Românească
        </p>

        <h1
          className="font-signature leading-none select-none"
          style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', color: 'var(--color-terra)' }}
        >
          Maria Cutinov
        </h1>

        <p
          className="font-serif text-lg leading-relaxed"
          style={{ color: 'rgba(237,232,222,0.55)' }}
        >
          Acuarele și uleiuri originale — fiecare lucrare, un moment unic
        </p>

        <Link
          href="/gallery"
          className="inline-flex items-center gap-3 mt-4 transition-colors"
          style={{
            border: '1px solid rgba(122,107,85,0.35)',
            color: 'var(--color-muted)',
            padding: '0.75rem 2.5rem',
            fontSize: '0.7rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
          }}
        >
          Descoperă Galeria
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Bottom brush-stroke line */}
      <div aria-hidden className="relative mt-8">
        <svg viewBox="0 0 260 18" className="w-52 opacity-20" fill="none">
          <path
            d="M4,9 C30,15 60,3 90,9 S140,15 170,9 S220,3 256,9"
            stroke="#C05050" strokeWidth="1.2" strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Vertical fade line at bottom */}
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-px h-16"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(122,107,85,0.5), transparent)' }}
      />
    </section>
  )
}
