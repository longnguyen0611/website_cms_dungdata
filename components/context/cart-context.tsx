"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface CartContextType {
  count: number
  refresh: () => Promise<void>
  increment: (amount?: number) => void
}

const CartContext = createContext<CartContextType>({
  count: 0,
  refresh: async () => {},
  increment: () => {}
})

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)

  const refresh = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: cart } = await supabase
      .from("carts")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .single()

    if (cart) {
      const { data: items } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("cart_id", cart.id)

      const total = items?.reduce((sum, i) => sum + i.quantity, 0) || 0
      setCount(total)
    } else {
      setCount(0)
    }
  }

  const increment = (amount = 1) => {
    setCount((prev) => prev + amount)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <CartContext.Provider value={{ count, refresh, increment }}>
      {children}
    </CartContext.Provider>
  )
}
