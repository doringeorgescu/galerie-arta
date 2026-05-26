'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient, createServiceClient } from '@/lib/supabase-server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user
}


export async function createPainting(formData: FormData) {
  await requireAdmin()

  const imageUrl = formData.get('imageUrl') as string
  if (!imageUrl) throw new Error('Imaginea este obligatorie')

  const extraImages = JSON.parse((formData.get('extraImages') as string) || '[]')

  await prisma.painting.create({
    data: {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      priceBani: Math.round(parseFloat(formData.get('priceRon') as string) * 100),
      imageUrl,
      imageKey: formData.get('imageKey') as string,
      widthCm: parseFloat(formData.get('widthCm') as string),
      heightCm: parseFloat(formData.get('heightCm') as string),
      year: parseInt(formData.get('year') as string),
      medium: formData.get('medium') as string,
      dominantColor: (formData.get('dominantColor') as string) || null,
      status: (formData.get('status') as 'AVAILABLE' | 'RESERVED' | 'SOLD') ?? 'AVAILABLE',
      extraImages,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/paintings')
  redirect('/admin/paintings')
}

export async function updatePainting(id: string, formData: FormData) {
  await requireAdmin()

  const extraImages = JSON.parse((formData.get('extraImages') as string) || '[]')

  await prisma.painting.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      priceBani: Math.round(parseFloat(formData.get('priceRon') as string) * 100),
      imageUrl: formData.get('imageUrl') as string,
      imageKey: formData.get('imageKey') as string,
      widthCm: parseFloat(formData.get('widthCm') as string),
      heightCm: parseFloat(formData.get('heightCm') as string),
      year: parseInt(formData.get('year') as string),
      medium: formData.get('medium') as string,
      dominantColor: (formData.get('dominantColor') as string) || null,
      status: formData.get('status') as 'AVAILABLE' | 'RESERVED' | 'SOLD',
      extraImages,
    },
  })

  revalidatePath('/')
  revalidatePath('/admin/paintings')
  redirect('/admin/paintings')
}

export async function deletePainting(id: string) {
  await requireAdmin()

  const painting = await prisma.painting.findUnique({
    where: { id },
    select: { imageKey: true, extraImages: true },
  })

  if (painting) {
    const keysToDelete: string[] = []
    if (painting.imageKey && !painting.imageKey.startsWith('seed/')) {
      keysToDelete.push(painting.imageKey)
    }
    if (Array.isArray(painting.extraImages)) {
      for (const img of painting.extraImages as Array<{ key: string }>) {
        if (img.key && !img.key.startsWith('seed/')) keysToDelete.push(img.key)
      }
    }
    if (keysToDelete.length > 0) {
      const supabase = createServiceClient()
      await supabase.storage.from('picturi').remove(keysToDelete)
    }
  }

  await prisma.painting.delete({ where: { id } })

  revalidatePath('/')
  revalidatePath('/admin/paintings')
  redirect('/admin/paintings')
}

export async function updateOrderStatus(id: string, status: 'PENDING' | 'PAID' | 'SHIPPED') {
  await requireAdmin()
  await prisma.order.update({ where: { id }, data: { status } })
  revalidatePath('/admin/orders')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
