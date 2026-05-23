'use client'

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react'

export type CartItem = {
  id: string
  slug: string
  title: string
  priceBani: number
  imageUrl: string
}

type State = { items: CartItem[]; open: boolean }

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD':
      if (state.items.find(i => i.id === action.item.id))
        return { ...state, open: true }
      return { items: [...state.items, action.item], open: true }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'HYDRATE':
      return { ...state, items: action.items }
    case 'OPEN':
      return { ...state, open: true }
    case 'CLOSE':
      return { ...state, open: false }
  }
}

const CartContext = createContext<{
  items: CartItem[]
  isOpen: boolean
  count: number
  total: number
  add: (item: CartItem) => void
  remove: (id: string) => void
  clear: () => void
  openCart: () => void
  closeCart: () => void
  isInCart: (id: string) => boolean
}>({
  items: [], isOpen: false, count: 0, total: 0,
  add: () => {}, remove: () => {}, clear: () => {},
  openCart: () => {}, closeCart: () => {},
  isInCart: () => false,
})

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], open: false })
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('mc-cart')
      if (raw) dispatch({ type: 'HYDRATE', items: JSON.parse(raw) })
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem('mc-cart', JSON.stringify(state.items))
  }, [state.items, hydrated])

  return (
    <CartContext.Provider value={{
      items: state.items,
      isOpen: state.open,
      count: state.items.length,
      total: state.items.reduce((s, i) => s + i.priceBani, 0),
      add: item => dispatch({ type: 'ADD', item }),
      remove: id => dispatch({ type: 'REMOVE', id }),
      clear: () => dispatch({ type: 'CLEAR' }),
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
      isInCart: id => state.items.some(i => i.id === id),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
