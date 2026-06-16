'use client'

import { useState } from 'react'
import { createPainting, updatePainting } from '@/app/studio/actions'
import { ImageUpload } from './ImageUpload'
import { Button } from '@/components/ui/Button'
import type { Painting } from '@/types'

type ExtraImage = { url: string; key: string }

function parseExtraImages(raw: unknown): ExtraImage[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (x): x is ExtraImage =>
      typeof x === 'object' && x !== null && typeof (x as ExtraImage).url === 'string',
  )
}

function toSlug(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const inputClass =
  'w-full bg-canvas border border-muted/30 rounded px-3 py-2.5 text-ink text-sm focus:outline-none focus:border-accent transition-colors'
const labelClass = 'block text-xs text-muted uppercase tracking-widest mb-1.5'

export function PaintingForm({ painting }: { painting?: Painting }) {
  const [title, setTitle] = useState(painting?.title ?? '')
  const [slug, setSlug] = useState(painting?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(!!painting)
  const [imageUrl, setImageUrl] = useState(painting?.imageUrl ?? '')
  const [imageKey, setImageKey] = useState(painting?.imageKey ?? '')
  const [dominantColor, setDominantColor] = useState(painting?.dominantColor ?? '')
  const [extraImages, setExtraImages] = useState<ExtraImage[]>(() =>
    parseExtraImages((painting as { extraImages?: unknown } | undefined)?.extraImages),
  )
  const [extraUploading, setExtraUploading] = useState(false)
  const [extraError, setExtraError] = useState<string | null>(null)

  const action = painting ? updatePainting.bind(null, painting.id) : createPainting

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setTitle(val)
    if (!slugTouched) setSlug(toSlug(val))
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(e.target.value)
    setSlugTouched(true)
  }

  async function handleExtraImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext === 'heic' || ext === 'heif' || file.type === 'image/heic' || file.type === 'image/heif') {
      setExtraError('Format HEIC nesuportat. Exportați ca JPEG din aplicația Poze (Share → JPEG).')
      return
    }

    const input = e.target
    setExtraUploading(true)
    setExtraError(null)
    try {
      // Step 1: get a signed upload URL from the server (tiny request — no file data)
      const urlRes = await fetch('/api/admin/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      })
      const urlJson = await urlRes.json() as { signedUrl?: string; key?: string; publicUrl?: string; contentType?: string; error?: string }
      if (!urlRes.ok) throw new Error(urlJson.error || `Server error ${urlRes.status}`)
      const { signedUrl, key, publicUrl, contentType } = urlJson as Required<typeof urlJson>

      // Step 2: PUT the file directly to Supabase — bypasses Vercel payload limit
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': contentType },
        body: file,
      })
      if (!uploadRes.ok) {
        const t = await uploadRes.text().catch(() => uploadRes.statusText)
        throw new Error(`Upload failed (${uploadRes.status}): ${t.slice(0, 100)}`)
      }

      setExtraImages(prev => [...prev, { url: publicUrl, key }])
      input.value = ''
    } catch (err) {
      setExtraError(err instanceof Error ? err.message : 'Eroare la încărcarea imaginii.')
    } finally {
      setExtraUploading(false)
    }
  }

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      {/* Hidden fields populated by ImageUpload */}
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="imageKey" value={imageKey} />
      <input type="hidden" name="dominantColor" value={dominantColor} />
      <input type="hidden" name="extraImages" value={JSON.stringify(extraImages)} />

      <ImageUpload
        currentUrl={painting?.imageUrl}
        onUpload={(url, key, color) => {
          setImageUrl(url)
          setImageKey(key)
          setDominantColor(color)
        }}
      />

      {/* Extra images */}
      <div className="space-y-3">
        <label className={labelClass}>Imagini suplimentare</label>

        {extraImages.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {extraImages.map((img, i) => (
              <div
                key={i}
                className="relative w-24 h-24 rounded border border-muted/20 overflow-hidden group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setExtraImages(prev => prev.filter((_, j) => j !== i))}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs items-center justify-center hidden group-hover:flex"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {extraError && <p className="text-red-400 text-xs">{extraError}</p>}

        <label
          className={`inline-flex items-center gap-2 px-4 py-2 rounded border text-sm cursor-pointer transition-colors ${
            extraUploading
              ? 'opacity-50 pointer-events-none border-muted/20 text-muted'
              : 'border-muted/30 text-muted hover:border-accent hover:text-ink'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleExtraImageChange}
            className="sr-only"
            disabled={extraUploading}
          />
          {extraUploading ? 'Se încarcă…' : '+ Adaugă imagine'}
        </label>
      </div>

      <div>
        <label className={labelClass}>Titlu</label>
        <input
          name="title"
          value={title}
          onChange={handleTitleChange}
          required
          className={inputClass}
          placeholder="ex. Amurg la Dunăre"
        />
      </div>

      <div>
        <label className={labelClass}>Slug (URL)</label>
        <input
          name="slug"
          value={slug}
          onChange={handleSlugChange}
          required
          className={`${inputClass} font-mono`}
          placeholder="amurg-la-dunare"
        />
      </div>

      <div>
        <label className={labelClass}>Descriere</label>
        <textarea
          name="description"
          defaultValue={painting?.description}
          required
          rows={4}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Preț (RON)</label>
          <input
            name="priceRon"
            type="number"
            min="0"
            step="1"
            defaultValue={painting ? Math.round(painting.priceBani / 100) : ''}
            required
            className={inputClass}
            placeholder="1500"
          />
        </div>
        <div>
          <label className={labelClass}>An</label>
          <input
            name="year"
            type="number"
            min="1900"
            max="2100"
            defaultValue={painting?.year ?? new Date().getFullYear()}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Lățime (cm)</label>
          <input
            name="widthCm"
            type="number"
            min="0"
            step="0.5"
            defaultValue={painting?.widthCm}
            required
            className={inputClass}
            placeholder="60"
          />
        </div>
        <div>
          <label className={labelClass}>Înălțime (cm)</label>
          <input
            name="heightCm"
            type="number"
            min="0"
            step="0.5"
            defaultValue={painting?.heightCm}
            required
            className={inputClass}
            placeholder="80"
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tehnică</label>
        <input
          name="medium"
          defaultValue={painting?.medium}
          required
          className={inputClass}
          placeholder="Ulei pe pânză"
        />
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <select
          name="status"
          defaultValue={painting?.status ?? 'AVAILABLE'}
          className={inputClass}
        >
          <option value="AVAILABLE">Disponibil</option>
          <option value="RESERVED">Rezervat</option>
          <option value="SOLD">Vândut</option>
        </select>
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        {painting ? 'Salvează modificările' : 'Adaugă lucrarea'}
      </Button>
    </form>
  )
}
