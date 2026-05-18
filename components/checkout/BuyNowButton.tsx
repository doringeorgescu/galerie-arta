'use client'
import { Button } from '@/components/ui/Button'

export function BuyNowButton({ paintingId }: { paintingId: string }) {
  return (
    <form action="/api/checkout" method="POST">
      <input type="hidden" name="paintingId" value={paintingId} />
      <Button type="submit" className="w-full sm:w-auto text-base py-4 px-8">
        Cumpără Acum
      </Button>
    </form>
  )
}
