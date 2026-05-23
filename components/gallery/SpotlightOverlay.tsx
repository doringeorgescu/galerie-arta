'use client'

import { motion } from 'framer-motion'

export function SpotlightOverlay({ active }: { active: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5, mixBlendMode: 'screen' }}
      animate={
        active
          ? {
              opacity: [0.62, 0.80, 0.66, 0.88, 0.70, 0.82, 0.62],
              x: [0, 1.5, -1, 2.5, -0.5, 1, 0],
              y: [0, -1, 1.5, -1, 1.5, -0.5, 0],
            }
          : { opacity: 0, x: 0, y: 0 }
      }
      transition={
        active
          ? {
              duration: 11,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              times: [0, 0.18, 0.33, 0.5, 0.65, 0.82, 1],
            }
          : { duration: 0.4 }
      }
    >
      {/* Beam principal — oval strâns, intens sus */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 65% 52% at 50% 16%, rgba(255,248,220,0.52) 0%, rgba(255,235,175,0.22) 38%, rgba(255,215,130,0.06) 62%, transparent 76%)',
        }}
      />
      {/* Fill secundar — lumină difuză pe restul tabloului */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 88% 72% at 48% 32%, rgba(255,242,200,0.14) 0%, transparent 64%)',
        }}
      />
    </motion.div>
  )
}
