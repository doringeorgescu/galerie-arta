'use client'

import { useState } from 'react'

function checkHeic(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext === 'heic' || ext === 'heif' ||
    file.type === 'image/heic' || file.type === 'image/heif'
}

async function extractDominantColor(blobUrl: string): Promise<string> {
  try {
    const { getColorSync } = await import('colorthief')
    const img = new Image()
    img.src = blobUrl
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('load failed'))
    })
    const color = getColorSync(img)
    return color?.hex() ?? '#C05050'
  } catch {
    return '#C05050'
  }
}

type Props = {
  currentUrl?: string
  onUpload: (url: string, key: string, dominantColor: string) => void
}

export function ImageUpload({ currentUrl, onUpload }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)
  const [uploading, setUploading] = useState(false)
  const [colorSwatch, setColorSwatch] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.files?.[0]
    if (!raw) return

    if (checkHeic(raw)) {
      setUploadError('Format HEIC nesuportat. Exportați ca JPEG din aplicația Poze (Share → JPEG) sau schimbați în Setări iPhone → Cameră → Formate → "Cel mai compatibil".')
      return
    }

    setUploading(true)
    setUploadError(null)

    try {
      const blobUrl = URL.createObjectURL(raw)
      const file = raw
      setPreview(blobUrl)

      // Get signed URL + extract dominant color in parallel
      const [urlJson, dominantHex] = await Promise.all([
        fetch('/api/admin/upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        }).then(r => r.json()) as Promise<{ signedUrl: string; key: string; publicUrl: string; contentType: string; error?: string }>,
        extractDominantColor(blobUrl),
      ])

      if (urlJson.error) throw new Error(urlJson.error)

      // Upload directly to Supabase — bypasses Vercel payload limit
      const uploadRes = await fetch(urlJson.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': urlJson.contentType },
        body: file,
      })
      if (!uploadRes.ok) throw new Error(`Upload failed (${uploadRes.status})`)

      const { publicUrl: url, key } = urlJson

      setColorSwatch(dominantHex)
      onUpload(url, key, dominantHex)
    } catch (err) {
      setUploadError('Eroare la încărcare. Verificați conexiunea și accesul la bucket-ul Supabase Storage.')
      setPreview(currentUrl ?? null)
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs text-muted uppercase tracking-widest">Imagine</label>

      {preview && (
        <div className="relative w-36 h-48 overflow-hidden rounded border border-muted/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-canvas/60 flex items-center justify-center">
              <span className="text-xs text-muted">Se încarcă…</span>
            </div>
          )}
        </div>
      )}

      {colorSwatch && (
        <div className="flex items-center gap-2 text-xs text-muted">
          <div
            className="w-4 h-4 rounded-full border border-muted/30 shrink-0"
            style={{ background: colorSwatch }}
          />
          <span>Culoare dominantă: {colorSwatch}</span>
        </div>
      )}

      {uploadError && <p className="text-red-400 text-xs">{uploadError}</p>}

      <label
        className={`inline-flex items-center gap-2 px-4 py-2 rounded border text-sm cursor-pointer transition-colors ${
          uploading
            ? 'opacity-50 pointer-events-none border-muted/20 text-muted'
            : 'border-muted/30 text-muted hover:border-accent hover:text-ink'
        }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          disabled={uploading}
        />
        {uploading ? 'Se încarcă…' : preview ? 'Schimbă imaginea' : 'Alege imaginea'}
      </label>
    </div>
  )
}
