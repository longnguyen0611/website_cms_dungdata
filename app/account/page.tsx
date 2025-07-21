"use client"

import { useState } from "react"
import { Calendar, Download, ShoppingCart, Edit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Mock data
const userData = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  phone: "0123456789",
  joinDate: "15/01/2025",
  totalDownloads: 12,
  totalOrders: 3,
}

const downloadHistory = [
  {
    id: 1,
    name: "Ebook: Nghiên cứu định lượng trong khoa học xã hội",
    category: "Ebook",
    downloadDate: "20/01/2025",
    fileSize: "2.4 MB",
  },
  {
    id: 2,
    name: "Dữ liệu khảo sát hành vi tiêu dùng 2024",
    category: "Dữ liệu mẫu",
    downloadDate: "18/01/2025",
    fileSize: "1.8 MB",
  },
  {
    id: 3,
    name: "Hướng dẫn phân tích hồi quy tuyến tính với SPSS",
    category: "SPSS",
    downloadDate: "15/01/2025",
    fileSize: "850 KB",
  },
]

const orderHistory = [
  {
    id: "DH001",
    date: "22/01/2025",
    items: 2,
    total: "299,000 VNĐ",
    status: "completed",
  },
  {
    id: "DH002",
    date: "18/01/2025",
    items: 1,
    total: "149,000 VNĐ",
    status: "completed",
  },
  {
    id: "DH003",
    date: "15/01/2025",
    items: 3,
    total: "450,000 VNĐ",
    status: "processing",
  },
]

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(userData)

  const handleSave = () => {
    // Handle save user data
    console.log("Saving user data:", formData)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentRole="user" />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tài khoản của tôi</h1>
            <p className="text-gray-600">Quản lý thông tin cá nhân và lịch sử hoạt động</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
              <TabsTrigger value="downloads">Tài liệu đã tải</TabsTrigger>
              <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
              <TabsTrigger value="settings">Cài đặt</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Thông tin cá nhân</CardTitle>
                          <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
                        </div>
                        <Button
                          variant={isEditing ? "default" : "outline"}
                          size="sm"
                          onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        >
                          {isEditing ? (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Lưu
                            </>
                          ) : (
                            <>
                              <Edit className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Stats */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Thống kê hoạt động</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Ngày tham gia</span>
                        </div>
                        <span className="font-medium">{userData.joinDate}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Tài liệu đã tải</span>
                        </div>
                        <Badge variant="secondary">{userData.totalDownloads}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Tổng đơn hàng</span>
                        </div>
                        <Badge variant="secondary">{userData.totalOrders}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads">
              <Card>
                <CardHeader>
                  <CardTitle>Tài liệu đã tải xuống</CardTitle>
                  <CardDescription>Lịch sử tải xuống tài liệu và ebook</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên tài liệu</TableHead>
                        <TableHead>Chuyên mục</TableHead>
                        <TableHead>Ngày tải</TableHead>
                        <TableHead>Dung lượng</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {downloadHistory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{item.category}</Badge>
                          </TableCell>
                          <TableCell>{item.downloadDate}</TableCell>
                          <TableCell>{item.fileSize}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Tải lại
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                  <CardDescription>Theo dõi các đơn hàng đã đặt</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã đơn hàng</TableHead>
                        <TableHead>Ngày đặt</TableHead>
                        <TableHead>Số sản phẩm</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderHistory.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell>{order.items} sản phẩm</TableCell>
                          <TableCell className="font-medium">{order.total}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                              {order.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Xem chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Đổi mật khẩu</CardTitle>
                    <CardDescription>Cập nhật mật khẩu để bảo mật tài khoản</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Cập nhật mật khẩu</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cài đặt thông báo</CardTitle>
                    <CardDescription>Quản lý các thông báo qua email</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Thông báo bài viết mới</p>
                        <p className="text-sm text-gray-500">Nhận email khi có bài viết mới</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Thông báo ebook mới</p>
                        <p className="text-sm text-gray-500">Nhận email khi có ebook mới</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Thông báo khuyến mãi</p>
                        <p className="text-sm text-gray-500">Nhận email về các chương trình khuyến mãi</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                    <Button>Lưu cài đặt</Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
