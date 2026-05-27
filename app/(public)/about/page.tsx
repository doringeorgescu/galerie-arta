import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Despre artist',
  description: 'Pictoriță română cu dragoste pentru natură și lumina caldă a amurgului.',
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="space-y-6 text-ink/80 leading-relaxed text-lg">
        <p>
          Bun venit în spațiul meu de explorare vizuală!
        </p>
        <p>
          Pentru mine, pictura nu este o simplă reproducere a realității, ci o căutare a frumuseții
          ascunse în felul în care lumina transformă tot ceea ce atinge. În lucrările mele, peisajele
          naturale și cele urbane devin pretexte pentru a experimenta cu stările schimbătoare ale
          atmosferei și cu interpretarea personală a culorii.
        </p>
        <p>
          Nu îmi doresc doar să împrumut nuanțele din natură și să le așez pe pânză, ci să le
          reinventez complet în atelier. Prin această abordare, caut să captez acea calitate fluidă,
          aproape lichidă, a luminii naturale, integrând-o organic în compoziție.
        </p>
        <h2 className="font-serif text-2xl text-ink pt-4">Lumina, Arhitectura și Dinamica Urbană</h2>
        <p>
          O fascinație aparte o reprezintă elementele arhitecturale și modul în care ele se topesc sau
          prind viață sub influența condițiilor de iluminare. Îmi propun să surprind pulsul orașelor
          și farmecul naturii arătând cum geometria clădirilor, viața străzii și detaliile cotidiene
          se joacă și se contopesc cu lumina.
        </p>
        <p>
          Călătoriile prin lume sunt busola mea emoțională. Ele îmi permit să privesc fiecare subiect
          din unghiuri culturale și interioare diferite. În tehnică, folosesc o gamă dinamică largă:
          îmi place să explorez dramatismul scenelor obișnuite prin tranziții fine, transformând
          tonurile întunecate în lumină. Este modul meu de a sugera privitorului o stare, o emoție,
          pe care el o interpretează la nivel personal.
        </p>
      </div>
    </section>
  )
}
