"use client"

import { useEffect, useState } from "react"
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type CartItemFormatted = {
  id: string
  post_id: string
  name: string
  category: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemFormatted[]>([])
  const [promoCode, setPromoCode] = useState("")
  const [cartId, setCartId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  useEffect(() => {
    const fetchCartData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setCartItems([])
        setLoading(false)
        return
      }

      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single()

      if (!cart) {
        setCartItems([])
        setLoading(false)
        return
      }

      setCartId(cart.id)

      const { data, error } = await supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          post_id,
          post:posts (
            id,
            title,
            category,
            price,
            thumbnail_url
          )
        `)
        .eq("cart_id", cart.id)

      if (error) {
        console.error("Error loading cart items:", error)
        setLoading(false)
        return
      }

      const items = (data as any[]).map((item) => ({
        id: item.id,
        post_id: item.post_id,
        name: item.post?.title ?? "Không tên",
        category: item.post?.category ?? "Không xác định",
        price: item.post?.price ?? 0,
        quantity: item.quantity,
        image: item.post?.thumbnail_url || "/placeholder.svg?height=80&width=80",
      }))

      setCartItems(items)
      setLoading(false)
    }

    fetchCartData()
  }, [])

  const updateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", id)
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    )
  }

  const removeItem = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id)
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 500000 ? 0 : 0
  const discount = 0
  const total = subtotal + shipping - discount

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price)


    const handleCheckout = async () => {
  if (!cartId || total == null) return

  // Cập nhật giỏ hàng: chỉ cập nhật total_price, không thay đổi status
  const { error: cartError } = await supabase
    .from("carts")
    .update({ total_price: total }) // KHÔNG cập nhật status
    .eq("id", cartId)

  if (cartError) {
    console.error("Lỗi cập nhật carts:", cartError)
    return
  }

  // Điều hướng sang trang QR thanh toán
  router.push(`/checkout/${cartId}`)
}


  return (
    <div className="min-h-screen bg-white">
      <Header currentRole="user" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng</h1>
            <p className="text-gray-600">Xem lại các sản phẩm trước khi thanh toán</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin h-8 w-8 rounded-full border-4 border-t-4 border-gray-200 border-t-primary"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h3>
                <p className="text-gray-600 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng</p>
                <Button asChild>
                  <a href="/">Tiếp tục mua sắm</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Sản phẩm trong giỏ hàng ({cartItems.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <p className="text-lg font-semibold text-primary mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tóm tắt đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Giảm giá</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mã giảm giá</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button variant="outline">Áp dụng</Button>
                    </div>
                  </CardContent>
                </Card>

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Tiến hành thanh toán
                </Button>


                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="/">Tiếp tục mua sắm</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
