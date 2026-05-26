import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
  webp: 'image/webp', gif: 'image/gif', avif: 'image/avif',
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { filename, contentType: rawType } = await request.json() as { filename: string; contentType: string }

  const ext = (filename?.split('.').pop() ?? '').toLowerCase()
  const contentType = rawType || EXT_TO_MIME[ext] || ''

  if (!ALLOWED_TYPES.has(contentType)) {
    return NextResponse.json({
      error: `Tipul fișierului nu este permis (${contentType || ext}). Folosește JPG, PNG, WEBP sau GIF.`,
    }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  const key = `paintings/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext || 'jpg'}`

  const { data, error } = await serviceClient.storage.from('picturi').createSignedUploadUrl(key)

  if (error || !data) {
    console.error('[upload-url]', error)
    return NextResponse.json({ error: error?.message ?? 'Failed to create upload URL' }, { status: 500 })
  }

  const { data: publicData } = serviceClient.storage.from('picturi').getPublicUrl(key)

  return NextResponse.json({ signedUrl: data.signedUrl, key, publicUrl: publicData.publicUrl, contentType })
}
