'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PaintingFrame } from './PaintingFrame'
import { SpotlightOverlay } from './SpotlightOverlay'
import { formatPrice } from '@/lib/color'
import type { Painting } from '@/types'

// Frame border (wood + mat) added to each side
const FRAME_PAD = 28

// Bounding box: the longest dimension is capped here
const MAX_LONG = 370
const MAX_SHORT = 320

// Spacing between card centers (works for mixed portrait/landscape)
const SPACING = 370
const SCALE_STEP = 0.25

/** Compute painting display dimensions maintaining aspect ratio, within max bounds */
function getPaintingSize(widthCm: number, heightCm: number) {
  const ratio = widthCm / (heightCm || 1)
  // Try filling to max height
  let w = Math.round(MAX_LONG * ratio)
  let h = MAX_LONG
  // If too wide, fill to max width instead
  if (w > MAX_SHORT) {
    w = MAX_SHORT
    h = Math.round(MAX_SHORT / ratio)
  }
  // But if the painting is taller than MAX_LONG (extreme portrait), cap it
  if (h > MAX_LONG) {
    h = MAX_LONG
    w = Math.round(MAX_LONG * ratio)
  }
  return { w, h }
}

function normalizedSeat(i: number, active: number, n: number): number {
  let d = i - active
  while (d > n / 2) d -= n
  while (d < -n / 2) d += n
  return d
}

function flatPosition(seat: number) {
  const abs = Math.abs(seat)
  return {
    x: seat * SPACING,
    y: abs * 20,
    rotate: seat * 1,
    scale: Math.max(0.42, 1 - abs * SCALE_STEP),
    opacity: Math.max(0.10, 1 - abs * 0.28),
    grayscale: abs === 0 ? 0 : Math.min(0.88, 0.5 + (abs - 1) * 0.38),
  }
}

export function MuseumCarousel({ paintings }: { paintings: Painting[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const wheelAccumRef = useRef(0)
  const cooldownRef = useRef(false)
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const n = paintings.length
  const activePainting = paintings[activeIndex]

  // Active painting's frame height — used to position the info block below
  const { h: activeH } = getPaintingSize(activePainting.widthCm, activePainting.heightCm)
  const activeFH = activeH + FRAME_PAD

  const prev = useCallback(() => setActiveIndex(i => (i - 1 + n) % n), [n])
  const next = useCallback(() => setActiveIndex(i => (i + 1) % n), [n])

  // Arrow key navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  // Wheel capture — one card per gesture, ignores trackpad inertia
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const THRESHOLD = 50
    const COOLDOWN = 720

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (cooldownRef.current) return
      wheelAccumRef.current += e.deltaY + e.deltaX
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => { wheelAccumRef.current = 0 }, 150)
      if (wheelAccumRef.current > THRESHOLD) {
        wheelAccumRef.current = 0
        cooldownRef.current = true
        next()
        clearTimeout(cooldownTimerRef.current)
        cooldownTimerRef.current = setTimeout(() => { cooldownRef.current = false }, COOLDOWN)
      } else if (wheelAccumRef.current < -THRESHOLD) {
        wheelAccumRef.current = 0
        cooldownRef.current = true
        prev()
        clearTimeout(cooldownTimerRef.current)
        cooldownTimerRef.current = setTimeout(() => { cooldownRef.current = false }, COOLDOWN)
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      clearTimeout(idleTimerRef.current)
      clearTimeout(cooldownTimerRef.current)
    }
  }, [prev, next])

  if (!paintings.length) {
    return (
      <div className="text-center py-24" style={{ color: 'var(--color-muted)' }}>
        <p className="text-lg font-serif">Nicio lucrare disponibilă momentan.</p>
        <p className="text-sm mt-2">Reveniți curând.</p>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', marginLeft: 'calc(50% - 50vw)' }}>
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none"
        style={{ height: 'min(88vh, 820px)', minHeight: 560, background: '#0D0B08' }}
      >
        {/* ══ CEILING ══ */}
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{ height: '14%', background: 'linear-gradient(to bottom, #020101 0%, #0D0B08 100%)' }}
        />
        <div
          aria-hidden
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '13.5%', height: 1,
            background: 'linear-gradient(to right, transparent 0%, rgba(60,45,25,0.6) 15%, rgba(60,45,25,0.6) 85%, transparent 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '80%', height: '100%',
            background: `conic-gradient(from -20deg at 50% -5%, transparent 0deg, rgba(255,215,140,0.018) 16deg, rgba(255,215,140,0.052) 40deg, rgba(255,215,140,0.018) 64deg, transparent 80deg)`,
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none z-30"
          style={{ top: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 180 }}
        >
          {[-1, 0, 1].map(offset => (
            <div
              key={offset}
              style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'rgba(255,248,225,0.95)',
                boxShadow: `0 0 5px 3px rgba(255,225,160,${offset === 0 ? '0.55' : '0.22'})`,
                opacity: offset === 0 ? 1 : 0.4,
              }}
            />
          ))}
        </div>
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            top: '5%', width: '42%', height: '60%',
            background: 'radial-gradient(ellipse at 50% 15%, rgba(255,218,150,0.14) 0%, rgba(255,200,120,0.06) 38%, transparent 65%)',
          }}
        />

        {/* ══ FLOOR ══ */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: '18%', background: 'linear-gradient(to top, #2E1C08 0%, #1E1208 45%, transparent 100%)' }}
        />
        <div
          aria-hidden
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            bottom: '17.5%', height: 1.5,
            background: 'linear-gradient(to right, transparent 0%, rgba(90,60,28,0.65) 10%, rgba(90,60,28,0.65) 90%, transparent 100%)',
          }}
        />

        {/* Side vignette */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none z-20"
          style={{ background: 'linear-gradient(to right, #0D0B08 0%, transparent 14%, transparent 86%, #0D0B08 100%)' }}
        />

        {/* ══ CARDS — each sized to its own painting proportions ══ */}
        <div
          className="absolute z-10"
          style={{ left: '50%', top: '38%', width: 0, height: 0 }}
        >
          {paintings
            .map((painting, i) => ({ painting, i }))
            .sort((a, b) => {
              const da = Math.abs(normalizedSeat(a.i, activeIndex, n))
              const db = Math.abs(normalizedSeat(b.i, activeIndex, n))
              return db - da
            })
            .map(({ painting, i }) => {
              const seat = normalizedSeat(i, activeIndex, n)
              const absSeat = Math.abs(seat)
              const { x, y, rotate, scale, opacity, grayscale } = flatPosition(seat)
              const isActive = seat === 0

              // Frame dimensions for THIS painting
              const { w: paintW, h: paintH } = getPaintingSize(painting.widthCm, painting.heightCm)
              const fw = paintW + FRAME_PAD
              const fh = paintH + FRAME_PAD

              return (
                <motion.div
                  key={painting.id}
                  animate={{
                    x: x - fw / 2,
                    y: y - fh / 2,
                    rotate,
                    opacity,
                    scale,
                    filter: `grayscale(${grayscale})`,
                  }}
                  transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{
                    position: 'absolute',
                    width: fw,
                    height: fh,
                    cursor: isActive ? 'default' : 'pointer',
                    zIndex: 10 - absSeat,
                  }}
                  onClick={() => { if (!isActive) setActiveIndex(i) }}
                >
                  <Link
                    href={`/paintings/${painting.slug}`}
                    onClick={e => { if (!isActive) e.preventDefault() }}
                    className="block w-full h-full"
                    tabIndex={isActive ? 0 : -1}
                  >
                    <PaintingFrame>
                      <div style={{ position: 'relative', width: paintW, height: paintH }}>
                        <Image
                          src={painting.imageUrl}
                          alt={painting.title}
                          fill
                          className="object-cover"
                          priority={i === 0}
                          sizes="400px"
                        />
                        <SpotlightOverlay active={isActive} />
                        {/* covers white paper/canvas margins with the mat colour */}
                        <div aria-hidden style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 10px #1A1410', pointerEvents: 'none' }} />
                      </div>
                    </PaintingFrame>
                  </Link>

                  {/* Faint title below adjacent cards */}
                  {absSeat === 1 && (
                    <div
                      className="absolute text-center pointer-events-none"
                      style={{ top: fh + 10, left: -40, right: -40 }}
                    >
                      <p
                        className="font-serif text-xs truncate"
                        style={{ color: 'rgba(237,232,222,0.28)' }}
                      >
                        {painting.title}
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
        </div>

        {/* ══ ACTIVE CARD INFO — positioned below active frame ══ */}
        <div
          className="absolute z-30 text-center pointer-events-none"
          style={{ left: 0, right: 0, top: `calc(38% + ${activeFH / 2 + 22}px)` }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <p className="font-serif text-xl tracking-wide" style={{ color: 'var(--color-ink)' }}>
                {activePainting.title}
              </p>
              <p className="text-xs mt-1.5 tracking-widest uppercase" style={{ color: 'var(--color-muted)' }}>
                {activePainting.year} · {activePainting.medium}
              </p>
              <p className="text-sm mt-2 font-medium" style={{ color: 'var(--color-accent)' }}>
                {formatPrice(activePainting.priceBani)}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ══ ARROW BUTTONS ══ */}
        {(['prev', 'next'] as const).map(dir => (
          <button
            key={dir}
            onClick={dir === 'prev' ? prev : next}
            aria-label={dir === 'prev' ? 'Tablou anterior' : 'Tablou următor'}
            style={{
              position: 'absolute', zIndex: 30,
              [dir === 'prev' ? 'left' : 'right']: 28,
              top: '38%', transform: 'translateY(-50%)',
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(30,24,18,0.80)',
              border: '1px solid rgba(122,107,85,0.25)',
              color: 'rgba(237,232,222,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(237,232,222,1)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(237,232,222,0.7)')}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={dir === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
              />
            </svg>
          </button>
        ))}

        {/* ══ DOT INDICATORS ══ */}
        <div
          className="absolute z-30 flex justify-center gap-2"
          style={{ left: 0, right: 0, bottom: 20 }}
        >
          {paintings.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Tablou ${i + 1}`}
              style={{
                width: i === activeIndex ? 20 : 8, height: 8, borderRadius: 4,
                background: i === activeIndex ? 'rgba(237,232,222,0.75)' : 'rgba(237,232,222,0.18)',
                border: 'none', padding: 0, cursor: 'pointer',
                transition: 'width 0.3s ease, background 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
