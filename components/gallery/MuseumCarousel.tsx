'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PaintingFrame } from './PaintingFrame'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/color'
import type { Painting } from '@/types'

const FRAME_PADDING = 44   // 14px frame + 8px mat, each side
const IMAGE_HEIGHT = 400
const BASE_HEIGHT = IMAGE_HEIGHT + FRAME_PADDING  // 444px
const GAP = 56

function imageWidth(p: Painting): number {
  const ratio = (p.widthCm || 3) / (p.heightCm || 4)
  return Math.round(IMAGE_HEIGHT * ratio)
}

export function MuseumCarousel({ paintings }: { paintings: Painting[] }) {
  const [active, setActive] = useState(0)
  const [containerWidth, setContainerWidth] = useState(1000)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setActive(i => Math.max(0, i - 1))
      if (e.key === 'ArrowRight') setActive(i => Math.min(paintings.length - 1, i + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paintings.length])

  const frameWidths = paintings.map(p => imageWidth(p) + FRAME_PADDING)

  const positions: number[] = []
  let cum = 0
  for (let i = 0; i < frameWidths.length; i++) {
    positions.push(cum)
    cum += frameWidths[i] + GAP
  }

  const activeCenter = positions[active] + frameWidths[active] / 2
  const translateX = containerWidth / 2 - activeCenter

  const prev = () => setActive(i => Math.max(0, i - 1))
  const next = () => setActive(i => Math.min(paintings.length - 1, i + 1))

  const activePainting = paintings[active]

  if (paintings.length === 0) {
    return (
      <div className="text-center py-24 text-muted">
        <p className="text-lg font-serif">Nicio lucrare disponibilă momentan.</p>
        <p className="text-sm mt-2">Reveniți curând.</p>
      </div>
    )
  }

  return (
    <div>
      {/* ─── MUSEUM ROOM ─── full bleed */}
      <div
        style={{
          width: '100vw',
          marginLeft: 'calc(50% - 50vw)',
        }}
      >
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          style={{
            height: 'min(88vh, 800px)',
            minHeight: 580,
            background: '#0D0B08',
          }}
        >
          {/* ══ CEILING ══ */}
          <div
            aria-hidden
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: '14%',
              background: 'linear-gradient(to bottom, #020101 0%, #0D0B08 100%)',
            }}
          />

          {/* Ceiling rail / cornice line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              top: '13.5%',
              height: 1,
              background:
                'linear-gradient(to right, transparent 0%, rgba(60,45,25,0.6) 15%, rgba(60,45,25,0.6) 85%, transparent 100%)',
            }}
          />

          {/* ══ SPOTLIGHT CONE (triangular beam from ceiling) ══ */}
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '80%',
              height: '100%',
              background: `conic-gradient(
                from -20deg at 50% -5%,
                transparent      0deg,
                rgba(255,215,140,0.018) 16deg,
                rgba(255,215,140,0.052) 40deg,
                rgba(255,215,140,0.018) 64deg,
                transparent     80deg
              )`,
            }}
          />

          {/* ══ CEILING LIGHT FIXTURES ══ */}
          {/* Three small warm bulbs above the strip */}
          <div
            aria-hidden
            className="absolute pointer-events-none z-30"
            style={{ top: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 180 }}
          >
            {[-1, 0, 1].map(offset => (
              <div
                key={offset}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'rgba(255,248,225,0.95)',
                  boxShadow: `0 0 5px 3px rgba(255,225,160,${offset === 0 ? '0.55' : '0.22'})`,
                  opacity: offset === 0 ? 1 : 0.4,
                  transition: 'all 0.6s',
                }}
              />
            ))}
          </div>

          {/* ══ WALL GLOW (warm oval on wall behind active painting) ══ */}
          <div
            aria-hidden
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              top: '10%',
              width: '42%',
              height: '62%',
              background:
                'radial-gradient(ellipse at 50% 15%, rgba(255,218,150,0.14) 0%, rgba(255,200,120,0.06) 38%, transparent 65%)',
              transition: 'all 0.7s',
            }}
          />

          {/* ══ FLOOR ══ */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '21%',
              background:
                'linear-gradient(to top, #2E1C08 0%, #1E1208 45%, transparent 100%)',
            }}
          />

          {/* Floor warm sheen (light bouncing up from below paintings) */}
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: '50%',
              height: '12%',
              background:
                'radial-gradient(ellipse at 50% 100%, rgba(255,175,70,0.07) 0%, transparent 70%)',
            }}
          />

          {/* Baseboard line */}
          <div
            aria-hidden
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              bottom: '20.5%',
              height: 1.5,
              background:
                'linear-gradient(to right, transparent 0%, rgba(90,60,28,0.65) 10%, rgba(90,60,28,0.65) 90%, transparent 100%)',
            }}
          />

          {/* ══ LEFT / RIGHT VIGNETTE ══ */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background:
                'linear-gradient(to right, #0D0B08 0%, transparent 13%, transparent 87%, #0D0B08 100%)',
            }}
          />

          {/* ══ PAINTINGS STRIP ══ */}
          <motion.div
            className="absolute flex items-end z-10"
            style={{ left: 0, bottom: '21%', gap: GAP }}
            animate={{ x: translateX }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {paintings.map((painting, i) => {
              const isActive = i === active
              const distance = Math.abs(i - active)
              const scale = isActive ? 1 : Math.max(0.40, 0.70 - distance * 0.13)
              const opacity = isActive ? 1 : Math.max(0.15, 0.58 - distance * 0.17)
              const iw = imageWidth(painting)
              const fw = iw + FRAME_PADDING

              return (
                <motion.div
                  key={painting.id}
                  animate={{ scale, opacity }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  style={{
                    width: fw,
                    height: BASE_HEIGHT,
                    flexShrink: 0,
                    transformOrigin: 'center bottom',
                  }}
                  className={isActive ? 'cursor-default' : 'cursor-pointer'}
                  onClick={() => { if (!isActive) setActive(i) }}
                >
                  <Link
                    href={`/paintings/${painting.slug}`}
                    onClick={e => { if (!isActive) e.preventDefault() }}
                    className="block w-full h-full"
                    tabIndex={isActive ? 0 : -1}
                  >
                    <PaintingFrame>
                      <div className="relative" style={{ width: iw, height: IMAGE_HEIGHT }}>
                        <Image
                          src={painting.imageUrl}
                          alt={painting.title}
                          fill
                          className="object-cover"
                          priority={isActive || i === 0}
                          sizes="(max-width: 640px) 85vw, 600px"
                        />
                      </div>
                    </PaintingFrame>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* ─── ACTIVE PAINTING INFO ─── */}
      <div className="mx-auto max-w-2xl px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.28 }}
            className="mt-8 text-center space-y-2"
          >
            <h2 className="font-serif text-ink text-2xl leading-snug">
              {activePainting.title}
            </h2>
            <p className="text-muted text-sm tracking-wide">
              {activePainting.year} · {activePainting.medium} · {activePainting.widthCm} × {activePainting.heightCm} cm
            </p>
            <p className="text-accent font-medium text-lg">
              {formatPrice(activePainting.priceBani)}
            </p>
            <div className="flex items-center justify-center gap-4 pt-1">
              <Badge status={activePainting.status} />
              <Link
                href={`/paintings/${activePainting.slug}`}
                className="text-xs text-muted hover:text-ink border border-muted/25 hover:border-muted/50 px-5 py-1.5 transition-colors tracking-widest uppercase"
              >
                Detalii →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            disabled={active === 0}
            aria-label="Tabloul anterior"
            className="w-10 h-10 rounded-full border border-muted/20 text-muted hover:border-accent hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            {paintings.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Tabloul ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-5 bg-accent' : 'w-1.5 bg-muted/30 hover:bg-muted/60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={active === paintings.length - 1}
            aria-label="Tabloul următor"
            className="w-10 h-10 rounded-full border border-muted/20 text-muted hover:border-accent hover:text-ink disabled:opacity-20 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            →
          </button>
        </div>

        <p className="text-center text-xs text-muted/35 mt-3 tracking-widest uppercase">
          ← → navigare cu tastatura
        </p>
      </div>
    </div>
  )
}
