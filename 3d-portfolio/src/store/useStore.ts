import { create } from 'zustand'
import type { CartItem, Product } from '../data/content'

// ── Theme ─────────────────────────────────────────────────────────────────────
type Theme = 'light' | 'dark'
type View  = '3d' | 'classic'

interface UIState {
  theme: Theme
  view: View
  cartOpen: boolean
  activeSection: string | null
  muted: boolean

  setTheme: (t: Theme) => void
  toggleTheme: () => void
  setView: (v: View) => void
  setCartOpen: (o: boolean) => void
  setActiveSection: (s: string | null) => void
  toggleMuted: () => void

  // Cart
  cart: CartItem[]
  addToCart: (p: Product) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  cartCount: () => number
}

export const useStore = create<UIState>((set, get) => ({
  theme: 'light',
  view: '3d',
  cartOpen: false,
  activeSection: null,
  muted: true,
  cart: [],

  setTheme: (t) => {
    set({ theme: t })
    document.documentElement.setAttribute('data-theme', t)
  },
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light'
    get().setTheme(next)
  },
  setView: (v) => set({ view: v }),
  setCartOpen: (o) => set({ cartOpen: o }),
  setActiveSection: (s) => set({ activeSection: s }),
  toggleMuted: () => set((s) => ({ muted: !s.muted })),

  addToCart: (p) =>
    set((s) => {
      const existing = s.cart.find((i) => i.product.id === p.id)
      if (existing) {
        return { cart: s.cart.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { cart: [...s.cart, { product: p, qty: 1 }] }
    }),
  removeFromCart: (id) =>
    set((s) => ({ cart: s.cart.filter((i) => i.product.id !== id) })),
  clearCart: () => set({ cart: [] }),
  cartCount: () => get().cart.reduce((n, i) => n + i.qty, 0),
}))
