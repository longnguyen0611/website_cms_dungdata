"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import AuthCheck from "@/components/admin/auth-check"

// Mock data
const categories = [
  {
    id: 1,
    name: "SPSS",
    slug: "spss",
    description: "Hướng dẫn sử dụng SPSS từ cơ bản đến nâng cao",
    color: "#3B82F6",
    icon: "📊",
    postCount: 45,
    status: "active",
    order: 1,
  },
  {
    id: 2,
    name: "Ebooks",
    slug: "ebooks",
    description: "Sách điện tử về nghiên cứu và phân tích dữ liệu",
    color: "#10B981",
    icon: "📚",
    postCount: 24,
    status: "active",
    order: 2,
  },
  {
    id: 3,
    name: "Dữ liệu mẫu",
    slug: "data",
    description: "Bộ dữ liệu mẫu cho thực hành và nghiên cứu",
    color: "#8B5CF6",
    icon: "💾",
    postCount: 18,
    status: "active",
    order: 3,
  },
  {
    id: 4,
    name: "Blog",
    slug: "blog",
    description: "Bài viết chuyên sâu về nghiên cứu xã hội",
    color: "#F59E0B",
    icon: "✍️",
    postCount: 32,
    status: "active",
    order: 4,
  },
  {
    id: 5,
    name: "Nghiên cứu định lượng",
    slug: "quantitative-research",
    description: "Phương pháp nghiên cứu định lượng trong khoa học xã hội",
    color: "#EF4444",
    icon: "🔬",
    postCount: 15,
    status: "active",
    order: 5,
  },
]

export default function AdminCategoriesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const deleteCategory = (id: number) => {
    console.log("Delete category:", id)
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Quản lý chuyên mục" sidebarCollapsed={sidebarCollapsed} />

          <main className="p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Danh sách chuyên mục</CardTitle>
                    <CardDescription>Quản lý các chuyên mục nội dung của website</CardDescription>
                  </div>
                  <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm chuyên mục
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Thêm chuyên mục mới</DialogTitle>
                        <DialogDescription>Tạo chuyên mục nội dung mới cho website</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="categoryName">Tên chuyên mục *</Label>
                          <Input id="categoryName" placeholder="Nhập tên chuyên mục..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categorySlug">Slug</Label>
                          <Input id="categorySlug" placeholder="duong-dan-chuyen-muc" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoryDescription">Mô tả</Label>
                          <Textarea id="categoryDescription" placeholder="Mô tả ngắn về chuyên mục..." rows={3} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryIcon">Icon (Emoji)</Label>
                            <Input id="categoryIcon" placeholder="📊" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="categoryColor">Màu sắc</Label>
                            <Input id="categoryColor" type="color" defaultValue="#3B82F6" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoryOrder">Thứ tự hiển thị</Label>
                          <Input id="categoryOrder" type="number" defaultValue="1" />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setCreateCategoryOpen(false)}>
                            Hủy
                          </Button>
                          <Button onClick={() => setCreateCategoryOpen(false)}>Tạo chuyên mục</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm chuyên mục..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">STT</TableHead>
                      <TableHead>Chuyên mục</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Số bài viết</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category, index) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.order}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.icon}
                            </div>
                            <div>
                              <div className="font-medium">{category.name}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">/{category.slug}</code>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-sm text-gray-600">{category.description}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <FileText className="mr-1 h-4 w-4 text-gray-400" />
                            {category.postCount}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={category.status === "active" ? "default" : "secondary"}>
                            {category.status === "active" ? "Hoạt động" : "Tạm dừng"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Chỉnh sửa chuyên mục</DialogTitle>
                                  <DialogDescription>Cập nhật thông tin chuyên mục</DialogDescription>
                                </DialogHeader>
                                {editingCategory && (
                                  <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="editCategoryName">Tên chuyên mục *</Label>
                                      <Input id="editCategoryName" defaultValue={editingCategory.name} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="editCategorySlug">Slug</Label>
                                      <Input id="editCategorySlug" defaultValue={editingCategory.slug} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="editCategoryDescription">Mô tả</Label>
                                      <Textarea
                                        id="editCategoryDescription"
                                        defaultValue={editingCategory.description}
                                        rows={3}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="editCategoryIcon">Icon</Label>
                                        <Input id="editCategoryIcon" defaultValue={editingCategory.icon} />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="editCategoryColor">Màu sắc</Label>
                                        <Input
                                          id="editCategoryColor"
                                          type="color"
                                          defaultValue={editingCategory.color}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="editCategoryStatus">Trạng thái</Label>
                                      <Select defaultValue={editingCategory.status}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="active">Hoạt động</SelectItem>
                                          <SelectItem value="inactive">Tạm dừng</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex justify-end space-x-2 pt-4">
                                      <Button variant="outline">Hủy</Button>
                                      <Button>Cập nhật</Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Hiển thị {filteredCategories.length} trong tổng số {categories.length} chuyên mục
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Trước
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                      1
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
