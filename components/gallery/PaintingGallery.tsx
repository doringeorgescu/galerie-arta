'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { PaintingFrame } from './PaintingFrame'
import { MuseumLighting } from './MuseumLighting'

type GalleryImage = { url: string }

function ArrowButton({
  dir,
  onClick,
}: {
  dir: 'prev' | 'next'
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Imaginea anterioară' : 'Imaginea următoare'}
      style={{
        position: 'absolute',
        [dir === 'prev' ? 'left' : 'right']: -22,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: 'rgba(13,11,8,0.82)',
        border: '1px solid rgba(122,107,85,0.28)',
        color: 'rgba(237,232,222,0.80)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(237,232,222,1)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(237,232,222,0.80)')}
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={dir === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
        />
      </svg>
    </button>
  )
}

function LightboxArrow({ dir, onClick }: { dir: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Imaginea anterioară' : 'Imaginea următoare'}
      style={{
        position: 'absolute',
        [dir === 'prev' ? 'left' : 'right']: -60,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.18)',
        color: 'rgba(255,255,255,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
    >
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d={dir === 'prev' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )
}

export function PaintingGallery({
  images,
  title,
  widthCm,
  heightCm,
  dominantColor,
}: {
  images: GalleryImage[]
  title: string
  widthCm: number
  heightCm: number
  dominantColor?: string | null
}) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const total = images.length

  // Keyboard + scroll-lock for lightbox — must be before any early return
  useEffect(() => {
    if (!lightbox) return
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowLeft') setCurrent(i => (i - 1 + total) % total)
      if (e.key === 'ArrowRight') setCurrent(i => (i + 1) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, total])

  if (total === 0) return null

  const prev = () => setCurrent(i => (i - 1 + total) % total)
  const next = () => setCurrent(i => (i + 1) % total)

  return (
    <>
      <div>
        <MuseumLighting dominantColor={dominantColor}>
          <div style={{ position: 'relative' }}>
            <PaintingFrame>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  onClick={() => setLightbox(true)}
                  style={{ cursor: 'zoom-in' }}
                  title="Apasați pentru a mări"
                >
                  <Image
                    src={images[current].url}
                    alt={total > 1 ? `${title} – ${current + 1} / ${total}` : title}
                    width={600}
                    height={Math.round(600 * heightCm / widthCm)}
                    className="w-full h-auto block"
                    priority={current === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </PaintingFrame>

            {total > 1 && (
              <>
                <ArrowButton dir="prev" onClick={prev} />
                <ArrowButton dir="next" onClick={next} />
              </>
            )}
          </div>
        </MuseumLighting>

        {total > 1 && (
          <div className="flex gap-2 mt-5 justify-center flex-wrap">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Imaginea ${i + 1}`}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: `2px solid ${i === current ? 'var(--color-accent)' : 'transparent'}`,
                  opacity: i === current ? 1 : 0.45,
                  transition: 'opacity 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'none',
                }}
                onMouseEnter={e => { if (i !== current) e.currentTarget.style.opacity = '0.7' }}
                onMouseLeave={e => { if (i !== current) e.currentTarget.style.opacity = '0.45' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Imagine mărită"
          onClick={() => setLightbox(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(0,0,0,0.93)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(false)}
            aria-label="Închide"
            style={{
              position: 'absolute',
              top: 16,
              right: 20,
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 18,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
            }}
          >
            ✕
          </button>

          {/* Image + arrows */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', maxWidth: '88vw', maxHeight: '88vh' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[current].url}
              alt={title}
              style={{ maxWidth: '88vw', maxHeight: '88vh', objectFit: 'contain', display: 'block' }}
            />

            {total > 1 && (
              <>
                <LightboxArrow dir="prev" onClick={prev} />
                <LightboxArrow dir="next" onClick={next} />
              </>
            )}
          </div>

          {total > 1 && (
            <p style={{ position: 'absolute', bottom: 18, color: 'rgba(255,255,255,0.45)', fontSize: 13, letterSpacing: '0.05em' }}>
              {current + 1} / {total}
            </p>
          )}
        </div>
      )}
    </>
  )
}
