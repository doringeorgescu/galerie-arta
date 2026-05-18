import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Despre artist',
  description: 'Pictoriță română cu dragoste pentru natură și lumina caldă a amurgului.',
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-5xl text-ink mb-10">Despre artist</h1>
      <div className="space-y-6 text-ink/80 leading-relaxed text-lg">
        <p>
          Bun venit în galeria mea. Sunt o pictoriță română pasionată de peisaje și portrete,
          inspirată de lumina caldă a amurgului și de frumusețea naturii.
        </p>
        <p>
          Lucrările mele sunt realizate în tehnici tradiționale — ulei pe pânză, acrilice și
          cărbune — fiecare tablou purtând amprenta unui moment unic.
        </p>
        <p>
          Toate tablourile sunt originale, în unicat. Pentru comenzi speciale sau întrebări, mă
          puteți contacta direct.
        </p>
      </div>
    </section>
  )
}
