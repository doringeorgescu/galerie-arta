'use client'

import { motion } from 'framer-motion'
import { hexToRgba } from '@/lib/color'
import { SpotlightOverlay } from './SpotlightOverlay'

export function MuseumLighting({
  dominantColor,
  children,
}: {
  dominantColor?: string | null
  children: React.ReactNode
}) {
  const color = dominantColor ?? '#8B3A3A'
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow ambient din culoarea dominantă — pâlpâie lent */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-2xl blur-3xl scale-90 pointer-events-none"
        style={{ background: hexToRgba(color, 0.9) }}
        animate={{ opacity: [0.32, 0.44, 0.36, 0.48, 0.32] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative">
        <SpotlightOverlay active />
        {children}
      </div>
    </div>
  )
}
