"use client"

import { useState } from "react"
import { useCart } from "@/components/context/cart-context"

export function AddToCartButton({ postId }: { postId: string }) {
  const [added, setAdded] = useState(false)
  const [loading, setLoading] = useState(false)

  const { increment } = useCart()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId }),
      })

      if (res.status === 401) {
        window.location.href = "/login"
        return
      }

      if (res.ok) {
        setAdded(true)
        increment() // ✅ Tăng ngay số lượng giỏ hàng
      }
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={added || loading}
      className={`bg-primary text-white font-semibold px-6 py-2 rounded-lg h-full transition-colors ${
        added ? "bg-gray-300 text-gray-700" : "hover:bg-primary/90"
      }`}
    >
      {added ? "Đã thêm" : loading ? "Đang thêm..." : "Thêm vào giỏ"}
    </button>
  )
}
