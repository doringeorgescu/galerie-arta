export function PaintingFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '14px',
        background: '#1A1410',
        boxShadow:
          '0 12px 48px rgba(0,0,0,0.9), 0 3px 8px rgba(0,0,0,0.7), inset 0 2px 14px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(0,0,0,0.6)',
      }}
    >
      {children}
    </div>
  )
}
