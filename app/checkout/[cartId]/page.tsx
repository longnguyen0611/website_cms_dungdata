"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/components/context/cart-context"
export default function CheckoutPage() {
  const { cartId } = useParams()
  const router = useRouter()
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [showThankYou, setShowThankYou] = useState(false)
  const [addInfo, setAddInfo] = useState("donhang") // ✅ nội dung chuyển khoản
  const { refresh } = useCart()
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (user && user.email) {
        const emailPrefix = user.email.split("@")[0]
        setAddInfo(encodeURIComponent(emailPrefix)) // ✅ gán vào addInfo
      }

      const { data, error } = await supabase
        .from("carts")
        .select("total_price")
        .eq("id", cartId)
        .single()

      if (!error && data) {
        setTotal(data.total_price)
      }

      setLoading(false)
    }

    fetchData()
  }, [cartId])

const handleConfirm = async () => {
  if (!cartId || !total) return

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    console.error("Không thể lấy thông tin người dùng:", authError)
    return
  }
  // Tạo đơn hàng
  const { error: orderError } = await supabase.from("orders").insert({
    cart_id: cartId,
    user_id: user.id,
    total_price: total,
    status: "pending",
    note: null,
  })

  if (orderError) {
    console.error("Lỗi khi tạo đơn hàng:", orderError)
    return
  }
  // ✅ Cập nhật trạng thái giỏ hàng thành 'wait'
  const { error: updateError } = await supabase
    .from("carts")
    .update({ status: "wait" })
    .eq("id", cartId)

  if (updateError) {
    console.error("Lỗi khi cập nhật trạng thái giỏ hàng:", updateError)
    return
  }
 await refresh()
  setShowThankYou(true)
}

  if (loading) return <div className="p-8">Đang tải...</div>

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header currentRole="user" />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        {showThankYou ? (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl text-center space-y-3">
            <div className="text-3xl">🎉</div>
            <h2 className="text-2xl font-bold text-primary">Cảm ơn bạn đã tin tưởng sử dụng dịch vụ của chúng tôi!</h2>
            <p className="text-base text-gray-700">
              Đơn hàng của bạn đang được xử lý và sẽ hoàn tất trong vòng <strong>1–2 giờ</strong>.
            </p>
            <p className="text-base text-gray-700">
              Mọi thắc mắc, vui lòng <a href="/contact" className="underline text-blue-600 hover:text-blue-800">liên hệ với chúng tôi</a> để được hỗ trợ kịp thời.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Quét mã QR để thanh toán</h1>

            <Image
              src={`https://img.vietqr.io/image/mb-00686838888-compact.png?amount=${total}&addInfo=${addInfo}`}
              alt="QR thanh toán MB Bank"
              width={300}
              height={300}
            />

            <p className="text-gray-600 my-4 text-center">
              Vui lòng quét mã QR bằng ứng dụng ngân hàng và chuyển đúng số tiền:&nbsp;
              <strong className="text-primary text-xl">
                {total?.toLocaleString("vi-VN")} VNĐ
              </strong>
            </p>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleConfirm}>Tôi đã thanh toán</Button>
              <Button variant="ghost" onClick={() => router.push("/cart")}>
                Quay lại giỏ hàng
              </Button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
