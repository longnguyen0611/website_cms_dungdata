"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Loader2, Send, Search, Filter, Eye } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import AuthCheck from "@/components/admin/auth-check"
import { supabase } from "@/lib/supabase"

interface Order {
  id: string
  cart_id: string
  user_id: string
  total_price: number
  status: string
  note: string | null
  created_at: string
  user_email?: string
  user_name?: string
  items?: {
    id: string
    name: string
    quantity: number
  }[]
}

export default function AdminOrdersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setIsLoading(true)

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        cart_id,
        user_id,
        total_price,
        status,
        note,
        created_at,
        profiles:user_id(full_name, email),
        carts:cart_id(
          cart_items(
            quantity,
            posts:post_id(title)
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (error?.message) {
      console.error("Lỗi tải đơn hàng:", error.message)
      setIsLoading(false)
      return
    }

    const formatted = (data ?? []).map((o: any) => ({
      id: o.id,
      cart_id: o.cart_id,
      user_id: o.user_id,
      total_price: o.total_price,
      status: o.status,
      note: o.note,
      created_at: o.created_at,
      user_email: o.profiles?.email ?? "(Không có email)",
      user_name: o.profiles?.full_name ?? "(Không tên)",
      items:
        o.carts?.cart_items?.map((ci: any, idx: number) => ({
          id: `${ci.posts.title}-${idx}`,
          name: ci.posts.title,
          quantity: ci.quantity,
        })) ?? [],
    }))

    setOrders(formatted)
    setIsLoading(false)
  }

  async function handleAction(orderId: string, cartId: string, action: "confirm" | "reject" | "send") {
    setUpdatingId(orderId)
    if (action === "confirm") {
      await supabase.from("orders").update({ status: "confirmed" }).eq("id", orderId)
      await supabase.from("carts").update({ status: "paid" }).eq("id", cartId)
    } else if (action === "reject") {
      await supabase.from("orders").update({ status: "rejected" }).eq("id", orderId)
      await supabase.from("carts").update({ status: "canceled" }).eq("id", cartId)
    } else if (action === "send") {
      await supabase.from("orders").update({ note: "Đã gửi hàng" }).eq("id", orderId)
    }
    await fetchOrders()
    setUpdatingId(null)
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || o.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Quản lý đơn hàng" sidebarCollapsed={sidebarCollapsed} />
          <main className="p-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Đơn hàng</CardTitle>
                    <CardDescription>Xác nhận hoặc từ chối đơn hàng thủ công</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {orders.filter((o) => o.status === "pending").length} chờ xử lý
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm tên hoặc email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v)}>
                    <SelectTrigger className="w-48">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Lọc trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                      <SelectItem value="rejected">Đã từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Đang tải đơn hàng...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ghi chú</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell>{o.id.slice(0, 8)}</TableCell>
                          <TableCell>{o.user_name}</TableCell>
                          <TableCell>{o.user_email}</TableCell>
                          <TableCell>{o.total_price.toLocaleString()}đ</TableCell>
                          <TableCell>{new Date(o.created_at).toLocaleString("vi-VN")}</TableCell>
                          <TableCell>
                            <Badge variant="default">{o.status}</Badge>
                          </TableCell>
                          <TableCell>{o.note ?? "-"}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(o)}>
                                  <Eye className="h-4 w-4 mr-1" />Xem
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                                </DialogHeader>
                                <div>
                                  <ul className="mt-2 space-y-2">
                                    {Array.isArray(o.items) && o.items.length > 0 ? (
                                      o.items.map((item, idx) => (
                                        <li key={`${item.id}-${idx}`} className="text-sm">
                                          {item.name} x {item.quantity}
                                        </li>
                                      ))
                                    ) : (
                                      <li key="no-item" className="text-sm text-gray-500 italic">
                                        Không có sản phẩm
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {o.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleAction(o.id, o.cart_id, "confirm")}
                                  disabled={updatingId === o.id}
                                >
                                  {updatingId === o.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />Xác nhận
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleAction(o.id, o.cart_id, "reject")}
                                  disabled={updatingId === o.id}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />Từ chối
                                </Button>
                              </>
                            )}
                            {o.status === "confirmed" && !o.note && (
                              <Button
                                size="sm"
                                onClick={() => handleAction(o.id, o.cart_id, "send")}
                                disabled={updatingId === o.id}
                              >
                                <Send className="h-4 w-4 mr-1" />Đã gửi
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
