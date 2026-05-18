'use client'

import { useState } from 'react'
import { createPainting, updatePainting } from '@/app/admin/actions'
import { ImageUpload } from './ImageUpload'
import { Button } from '@/components/ui/Button'
import type { Painting } from '@/types'

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

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      {/* Hidden fields populated by ImageUpload */}
      <input type="hidden" name="imageUrl" value={imageUrl} />
      <input type="hidden" name="imageKey" value={imageKey} />
      <input type="hidden" name="dominantColor" value={dominantColor} />

      <ImageUpload
        currentUrl={painting?.imageUrl}
        onUpload={(url, key, color) => {
          setImageUrl(url)
          setImageKey(key)
          setDominantColor(color)
        }}
      />

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
