import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { CartProvider } from '@/lib/cart-context'
import { CartDrawer } from '@/components/ui/CartDrawer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
    </CartProvider>
  )
}
