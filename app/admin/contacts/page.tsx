"use client"

import { useState, useEffect } from "react"
import { Mail, MailOpen, Eye, Trash2, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface Message {
  id: string
  name: string
  email: string
  content: string
  is_read: boolean
  created_at: string
}

export default function AdminContactsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">("all")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .returns<Message[]>()

    if (error) console.error(error)
    else setMessages(data ?? [])
    setIsLoading(false)
  }

  async function markAsRead(id: string) {
    await supabase.from("messages").update({ is_read: true }).eq("id", id)
    fetchMessages()
  }

  async function deleteMessage(id: string) {
    await supabase.from("messages").delete().eq("id", id)
    fetchMessages()
  }

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "read" && m.is_read) ||
      (filterStatus === "unread" && !m.is_read)
    return matchesSearch && matchesFilter
  })

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Quản lý liên hệ" sidebarCollapsed={sidebarCollapsed} />
          <main className="p-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Thư liên hệ</CardTitle>
                    <CardDescription>Quản lý tất cả thư liên hệ từ người dùng</CardDescription>
                  </div>
                  <Badge variant="secondary">{messages.filter((m) => !m.is_read).length} chưa đọc</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filter & Search */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                    <SelectTrigger className="w-48">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Lọc trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="unread">Chưa đọc</SelectItem>
                      <SelectItem value="read">Đã đọc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Messages table */}
                {isLoading ? (
                  <div>Đang tải...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead></TableHead>
                        <TableHead>Người gửi</TableHead>
                        <TableHead>Nội dung</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((m) => (
                        <TableRow key={m.id} className={!m.is_read ? "bg-blue-50" : ""}>
                          <TableCell>
                            {m.is_read ? <MailOpen className="h-4 w-4 text-gray-400" /> : <Mail className="h-4 w-4 text-blue-600" />}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{m.name}</div>
                              <div className="text-sm text-gray-500">{m.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="truncate max-w-xs">{m.content}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600">{new Date(m.created_at).toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={m.is_read ? "secondary" : "default"}>{m.is_read ? "Đã đọc" : "Chưa đọc"}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedMessage(m)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Thư từ {m.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <p className="whitespace-pre-wrap">{m.content}</p>
                                    <div className="flex justify-end mt-4 space-x-2">
                                      {!m.is_read && (
                                        <Button onClick={() => markAsRead(m.id)}>Đánh dấu đọc</Button>
                                      )}
                                      <Button variant="outline" onClick={() => deleteMessage(m.id)}>
                                        Xóa
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => deleteMessage(m.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
