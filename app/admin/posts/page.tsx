"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Edit, Trash2, Search, Filter, Eye } from "lucide-react"
import { supabase } from "@/lib/supabase"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import AuthCheck from "@/components/admin/auth-check"

export default function AdminPostsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, category, views, created_at")

      console.log("Supabase response:", { data, error })

      if (error) {
        console.error("Lỗi khi lấy bài viết:", error.message || error)
      } else {
        setPosts(data || [])
      }
      setLoading(false)
    }

    fetchPosts()
  }, [])
const handleDelete = async (id: string) => {
  const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")
  if (!confirmDelete) return

  // Bước 1: Lấy bài viết để biết thumbnail
  const { data: post, error: fetchError } = await supabase
    .from("posts")
    .select("thumbnail")
    .eq("id", id)
    .single()

  if (fetchError) {
    alert("Lỗi khi lấy thông tin bài viết: " + fetchError.message)
    return
  }

  // Bước 2: Nếu có thumbnail thì xóa khỏi Supabase Storage
  if (post.thumbnail) {
    try {
      // Ví dụ thumbnail: https://.../storage/v1/object/public/image/1752749034017.jpg
      const url = new URL(post.thumbnail)
      const filePath = url.pathname.split("/public/")[1] // -> image/1752749034017.jpg

      const { error: deleteImageError } = await supabase.storage
        .from("image") // tên bucket
        .remove([filePath])

      if (deleteImageError) {
        console.error("Lỗi khi xóa ảnh thumbnail:", deleteImageError.message)
        // Có thể không return ở đây, vẫn cho xóa bài viết nếu cần
      }
    } catch (err) {
      console.error("Lỗi khi xử lý URL thumbnail:", err)
    }
  }

  // Bước 3: Xóa bài viết
  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    alert("Lỗi khi xóa bài viết: " + error.message)
  } else {
    setPosts(posts.filter((post) => post.id !== id))
  }
}


  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Quản lý bài viết" sidebarCollapsed={sidebarCollapsed} />

          <main className="p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Danh sách bài viết</CardTitle>
                    <CardDescription>Quản lý tất cả bài viết trong hệ thống</CardDescription>
                  </div>
                  <Link href="/admin/posts/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Tạo bài viết mới
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm bài viết..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Chọn chuyên mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả chuyên mục</SelectItem>
                      <SelectItem value="SPSS">SPSS</SelectItem>
                      <SelectItem value="Ebook">Ebook</SelectItem>
                      <SelectItem value="Dữ liệu mẫu">Dữ liệu mẫu</SelectItem>
                      <SelectItem value="Blog">Blog</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table or Loading */}
                {loading ? (
                  <div className="text-center text-gray-500 py-8">Đang tải dữ liệu...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Chuyên mục</TableHead>
                        <TableHead>Lượt xem</TableHead>
                        <TableHead>Ngày đăng</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium max-w-xs">
                            <div className="truncate">{post.title}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{post.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Eye className="mr-1 h-4 w-4 text-gray-400" />
                              {post.views?.toLocaleString() || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            {post.created_at
                              ? new Date(post.created_at).toLocaleDateString("vi-VN")
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link href={`/admin/posts/${post.id}/edit`}>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(post.id)}
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

                {/* Pagination giả lập */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Hiển thị {filteredPosts.length} trong tổng số {posts.length} bài viết
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Trước
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      Sau
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
