'use client'
import { hexToRgba } from '@/lib/color'

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
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl blur-3xl opacity-40 scale-90 pointer-events-none"
        style={{ background: hexToRgba(color, 0.9) }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
