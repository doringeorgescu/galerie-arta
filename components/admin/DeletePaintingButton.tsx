'use client'

import { deletePainting } from '@/app/studio/actions'

export function DeletePaintingButton({ id }: { id: string }) {
  return (
    <form action={deletePainting.bind(null, id)}>
      <button
        type="submit"
        className="text-xs text-red-400 hover:text-red-300 transition-colors"
        onClick={(e) => {
          if (!confirm('Ștergi această lucrare? Acțiunea nu poate fi anulată.')) {
            e.preventDefault()
          }
        }}
      >
        Șterge
      </button>
    </form>
  )
}
