"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Shield, User, Mail, Calendar, Search, Filter, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import AuthCheck from "@/components/admin/auth-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface UserProfile {
  id: string
  full_name: string | null
  role: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPass, setNewPass] = useState("")
  const [newRole, setNewRole] = useState("user")

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    setLoading(true)
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
    setLoading(false)
    if (error) console.error(error)
    else setUsers(data || [])
  }

  async function createUser() {
    try {
      setLoading(true)
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: newEmail,
        password: newPass,
        email_confirm: true,
      })
      if (authErr || !authData.user) {
        console.error(authErr)
        return
      }
      const profile = {
        id: authData.user.id,
        full_name: newName,
        role: newRole,
        avatar_url: "",
      }
      const { error: profErr } = await supabase.from("profiles").insert(profile)
      if (profErr) console.error(profErr)
      setCreateOpen(false)
      resetForm()
      fetchUsers()
    } finally { setLoading(false) }
  }

  function resetForm() {
    setNewName(""); setNewEmail(""); setNewPass(""); setNewRole("user")
  }

  async function deleteUser(id: string) {
    if (!confirm("Bạn chắc chắn muốn xóa người dùng này?")) return
    setDeletingId(id)
    try {
      await supabase.auth.admin.deleteUser(id)
      await supabase.from("profiles").delete().eq("id", id)
      fetchUsers()
    } catch (e) {
      console.error(e)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = users.filter(u =>
    (u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search)) &&
    (roleFilter === "all" || u.role === roleFilter)
  )

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <div className={`${sidebarCollapsed ? "ml-16" : "ml-64"} transition-all`}>
          <AdminHeader title="Quản lý người dùng" sidebarCollapsed={sidebarCollapsed} />
          <main className="p-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle>Danh sách người dùng</CardTitle>
                    <CardDescription>Quản lý tất cả user trong hệ thống</CardDescription>
                  </div>

                  <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="whitespace-nowrap">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm user
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Tạo người dùng mới</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Họ tên</Label>
                          <Input value={newName} onChange={(e) => setNewName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Mật khẩu</Label>
                          <Input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Vai trò</Label>
                          <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-end mt-4 space-x-2">
                          <Button variant="outline" onClick={() => setCreateOpen(false)}>Hủy</Button>
                          <Button onClick={createUser} disabled={loading}>
                            {loading ? "Đang tạo..." : "Tạo"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Input className="flex-1" placeholder="Tìm kiếm..." value={search} onChange={e => setSearch(e.target.value)}/>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-40"><Filter className="mr-2 h-4 w-4"/><SelectValue placeholder="Vai trò"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả vai trò</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="flex items-center space-x-3">
                          {u.role === "admin"
                            ? <Shield className="h-5 w-5 text-primary"/> 
                            : <User className="h-5 w-5 text-gray-600"/>
                          }
                          <div>
                            <div>{u.full_name}</div>
                            <div className="text-sm text-gray-500">{u.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.role === "admin" ? "default" : "outline"}>{u.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(u.created_at).toLocaleDateString("vi-VN")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="destructive" size="sm"
                            disabled={deletingId === u.id}
                            onClick={() => deleteUser(u.id)}>
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {loading && <div className="p-4 text-center text-gray-500">Đang tải...</div>}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
