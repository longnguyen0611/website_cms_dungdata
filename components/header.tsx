"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X, User, ShoppingCart, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { useCart } from "@/components/context/cart-context"

interface HeaderProps {
  currentRole?: "admin" | "user" | null
}

export default function Header({ currentRole }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "SPSS", href: "/spss" },
    { name: "Dữ liệu mẫu", href: "/data" },
    { name: "Ebooks", href: "/ebooks" },
    { name: "Blog", href: "/blog" },
    { name: "Liên hệ", href: "/contact" },
  ]
const cart = useCart()

  useEffect(() => {
  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser()

    if (data?.user) {
      const user_id = data.user.id

      // Lấy giỏ hàng trạng thái pending
      const { data: cart, error: cartErr } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user_id)
        .eq("status", "pending")
        .single()

      let cartItemCount = 0

      if (cart) {
        const { data: items, error: itemErr } = await supabase
          .from("cart_items")
          .select("quantity")
          .eq("cart_id", cart.id)

        if (items && !itemErr) {
          cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)
        }
      }

      const { email } = data.user
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role")
        .eq("id", user_id)
        .single()

      setUser({
        name: profileData?.full_name || "Người dùng",
        email: email || "user@email.com",
        cartItems: cartItemCount,
        role: profileData?.role || "user",
      })
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }

  getUser()
}, [])


  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              D
            </div>
            <span className="text-xl font-bold text-primary">Dũng Data</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && !user ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm"> 
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm"> 
                    Đăng ký
                  </Button>
                </Link>
              </>
            ) : !isLoading && user ? (
              <div className="flex items-center space-x-3">
                {user.role === "user" && (
                  <Link href="/cart">
                    <Button variant="ghost" size="sm" className="relative">
                      <ShoppingCart className="h-4 w-4" />
                      {cart.count > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {cart.count}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />

                    {user.role === "user" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/account" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            Tài khoản của tôi
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/orders" className="flex items-center">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Đơn hàng của tôi
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/account/downloads" className="flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            Tài liệu đã tải
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    {(currentRole === "admin" || user.role === "admin") && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="flex items-center text-primary">
                            <Settings className="mr-2 h-4 w-4" />
                            Quản trị hệ thống
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="flex items-center text-red-600 focus:text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="h-10 w-40" /> // placeholder
            )}
          </div>

          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-primary transition-colors px-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-2 pt-4 border-t">
                {!isLoading && !user ? (
                  <>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button size="sm" className="w-full">
                        Đăng ký
                      </Button>
                    </Link>
                  </>
                ) : !isLoading && user ? (
                  <>
                    <div className="px-2 py-2 border-b">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === "user" && (
                      <>
                        <Link href="/cart">
                          <Button variant="ghost" size="sm" className="relative">
                            <ShoppingCart className="h-4 w-4" />
                            {user.cartItems > 0 && (
                              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                {user.cartItems}
                              </Badge>
                            )}
                          </Button>
                        </Link>

                        <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" size="sm" className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" />
                            Tài khoản của tôi
                          </Button>
                        </Link>
                      </>
                    )}
                    {(currentRole === "admin" || user.role === "admin") && (
                      <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start text-primary">
                          <Settings className="mr-2 h-4 w-4" />
                          Quản trị hệ thống
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </Button>
                  </>
                ) : null}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}