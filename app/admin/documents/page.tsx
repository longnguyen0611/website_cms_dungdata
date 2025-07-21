"use client"

import { useState } from "react"
import { Upload, Download, Eye, Trash2, Search, Filter, FileText, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
// Thêm AuthCheck wrapper
import AuthCheck from "@/components/admin/auth-check"

// Mock data
const documents = [
  {
    id: 1,
    name: "Nghiên cứu định lượng trong khoa học xã hội",
    fileName: "nghien-cuu-dinh-luong.pdf",
    category: "Ebook",
    size: "2.4 MB",
    downloads: 156,
    uploadDate: "15/01/2025",
    allowDownload: true,
    description: "Cuốn sách hướng dẫn toàn diện về phương pháp nghiên cứu định lượng",
  },
  {
    id: 2,
    name: "Dữ liệu khảo sát hành vi tiêu dùng 2024",
    fileName: "du-lieu-hanh-vi-tieu-dung.xlsx",
    category: "Dữ liệu mẫu",
    size: "1.8 MB",
    downloads: 89,
    uploadDate: "12/01/2025",
    allowDownload: true,
    description: "Bộ dữ liệu khảo sát 1000 người tiêu dùng về thói quen mua sắm",
  },
  {
    id: 3,
    name: "Hướng dẫn sử dụng SPSS 29",
    fileName: "huong-dan-spss-29.pdf",
    category: "Ebook",
    size: "5.2 MB",
    downloads: 234,
    uploadDate: "10/01/2025",
    allowDownload: false,
    description: "Hướng dẫn chi tiết cách sử dụng SPSS phiên bản 29",
  },
  {
    id: 4,
    name: "Dataset nghiên cứu giáo dục đại học",
    fileName: "dataset-giao-duc.csv",
    category: "Dữ liệu mẫu",
    size: "3.1 MB",
    downloads: 67,
    uploadDate: "08/01/2025",
    allowDownload: true,
    description: "Dữ liệu về kết quả học tập và các yếu tố ảnh hưởng",
  },
  {
    id: 5,
    name: "Phân tích dữ liệu với R và Python",
    fileName: "phan-tich-du-lieu-r-python.pdf",
    category: "Ebook",
    size: "4.7 MB",
    downloads: 178,
    uploadDate: "05/01/2025",
    allowDownload: true,
    description: "Hướng dẫn sử dụng R và Python cho phân tích dữ liệu",
  },
]

// Wrap toàn bộ component trong AuthCheck
export default function AdminDocumentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleDownload = (id: number) => {
    console.log("Toggle download for document:", id)
  }

  const deleteDocument = (id: number) => {
    console.log("Delete document:", id)
  }

  const formatFileSize = (size: string) => {
    return size
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Quản lý tài liệu" sidebarCollapsed={sidebarCollapsed} />

          <main className="p-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thư viện tài liệu</CardTitle>
                    <CardDescription>Quản lý ebooks, dữ liệu mẫu và tài liệu khác</CardDescription>
                  </div>
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Tải lên tài liệu
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Tải lên tài liệu mới</DialogTitle>
                        <DialogDescription>Thêm ebook, dữ liệu mẫu hoặc tài liệu khác vào thư viện</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="docName">Tên tài liệu *</Label>
                          <Input id="docName" placeholder="Nhập tên tài liệu..." />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="docCategory">Chuyên mục *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn chuyên mục" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ebook">Ebook</SelectItem>
                              <SelectItem value="Dữ liệu mẫu">Dữ liệu mẫu</SelectItem>
                              <SelectItem value="Tài liệu khác">Tài liệu khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="docDescription">Mô tả</Label>
                          <Textarea id="docDescription" placeholder="Mô tả ngắn về tài liệu..." rows={3} />
                        </div>

                        <div className="space-y-2">
                          <Label>Tệp tài liệu *</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                              <Button variant="outline" size="sm">
                                Chọn tệp
                              </Button>
                              <p className="mt-2 text-xs text-gray-500">PDF, XLSX, CSV, DOC tối đa 10MB</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="allowDownload">Cho phép tải xuống</Label>
                          <Switch id="allowDownload" defaultChecked />
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                          <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                            Hủy
                          </Button>
                          <Button onClick={() => setUploadDialogOpen(false)}>Tải lên</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Tìm kiếm tài liệu..."
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
                      <SelectItem value="Ebook">Ebook</SelectItem>
                      <SelectItem value="Dữ liệu mẫu">Dữ liệu mẫu</SelectItem>
                      <SelectItem value="Tài liệu khác">Tài liệu khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Documents Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tên tài liệu</TableHead>
                      <TableHead>Chuyên mục</TableHead>
                      <TableHead>Dung lượng</TableHead>
                      <TableHead>Lượt tải</TableHead>
                      <TableHead>Ngày tải lên</TableHead>
                      <TableHead>Cho tải về</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {doc.fileName.endsWith(".pdf") ? (
                                <FileText className="h-8 w-8 text-red-500" />
                              ) : doc.fileName.endsWith(".xlsx") || doc.fileName.endsWith(".csv") ? (
                                <FileText className="h-8 w-8 text-green-500" />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-blue-500" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.fileName}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{doc.category}</Badge>
                        </TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Download className="mr-1 h-4 w-4 text-gray-400" />
                            {doc.downloads}
                          </div>
                        </TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>
                          <Switch checked={doc.allowDownload} onCheckedChange={() => toggleDownload(doc.id)} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteDocument(doc.id)}
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
                    Hiển thị {filteredDocuments.length} trong tổng số {documents.length} tài liệu
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
