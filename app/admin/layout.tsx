import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { signOut } from '@/app/admin/actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Unauthenticated: render children only (login page)
  if (!user) {
    return <div className="min-h-screen bg-canvas">{children}</div>
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-muted/20 bg-surface/60 sticky top-0 z-40 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <nav className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-ink text-lg">
              Admin
            </Link>
            <Link
              href="/admin/paintings"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Tablouri
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm text-muted hover:text-ink transition-colors"
            >
              Comenzi
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="text-xs text-muted hidden sm:block">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs text-muted hover:text-accent transition-colors"
              >
                Deconectare
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
