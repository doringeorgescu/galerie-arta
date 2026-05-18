export function PaintingFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '14px',
        background:
          'linear-gradient(135deg, #1E0E06 0%, #4A2E14 18%, #33180A 35%, #5C3A1C 50%, #33180A 65%, #4A2E14 82%, #1E0E06 100%)',
        boxShadow:
          '0 12px 48px rgba(0,0,0,0.9), 0 3px 8px rgba(0,0,0,0.7), inset 0 1px 0 rgba(160,100,50,0.2), inset 0 -1px 0 rgba(0,0,0,0.5)',
      }}
    >
      <div
        style={{
          padding: '8px',
          background: '#1A1410',
          boxShadow: 'inset 0 2px 14px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(0,0,0,0.6)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
