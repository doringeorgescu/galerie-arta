'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

const STATUSES = [
  { value: '', label: 'Toate' },
  { value: 'AVAILABLE', label: 'Disponibile' },
  { value: 'RESERVED', label: 'Rezervate' },
  { value: 'SOLD', label: 'Vândute' },
]

export function SearchInput({
  initialQuery = '',
  initialStatus = '',
}: {
  initialQuery?: string
  initialStatus?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState(initialStatus)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  function push(q: string, s: string) {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (s) params.set('status', s)
    const qs = params.toString()
    router.push(`/search${qs ? `?${qs}` : ''}`)
  }

  function handleQuery(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setQuery(q)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => push(q, status), 350)
  }

  function handleStatus(s: string) {
    setStatus(s)
    clearTimeout(timerRef.current)
    push(query, s)
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink mb-8">Caută lucrări</h1>

      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
          style={{ color: 'var(--color-muted)', opacity: 0.5 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          autoFocus
          type="search"
          value={query}
          onChange={handleQuery}
          placeholder="Titlu, tehnică, an..."
          className="w-full pl-12 pr-5 py-4 font-serif text-base rounded-sm focus:outline-none transition-colors"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid rgba(122,107,85,0.25)',
            color: 'var(--color-ink)',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'rgba(122,107,85,0.55)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(122,107,85,0.25)')}
        />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleStatus(value)}
            className="px-4 py-1.5 text-xs tracking-widest uppercase rounded-sm border transition-colors"
            style={
              status === value
                ? {
                    background: 'var(--color-accent)',
                    color: '#fff',
                    borderColor: 'var(--color-accent)',
                  }
                : {
                    background: 'transparent',
                    color: 'var(--color-muted)',
                    borderColor: 'rgba(122,107,85,0.25)',
                  }
            }
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
