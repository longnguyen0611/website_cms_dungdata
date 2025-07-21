import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { post_id } = await req.json()
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Tìm giỏ hàng 'pending'
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .single()

  let cart_id = cart?.id

  // Nếu chưa có giỏ → tạo mới
  if (!cart_id) {
    const { data: newCart, error: newCartErr } = await supabase
      .from("carts")
      .insert({ user_id: user.id })
      .select("id")
      .single()

    if (newCartErr) return NextResponse.json({ error: newCartErr.message }, { status: 500 })
    cart_id = newCart.id
  }

  // Kiểm tra sản phẩm đã tồn tại
  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart_id)
    .eq("post_id", post_id)
    .single()

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + 1 })
      .eq("id", existing.id)
  } else {
    await supabase
      .from("cart_items")
      .insert({ cart_id: cart_id, post_id })
  }

  return NextResponse.json({ success: true })
}
