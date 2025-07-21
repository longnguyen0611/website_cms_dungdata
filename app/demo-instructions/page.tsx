"use client"

import { Shield, User, Eye, Settings, FileText, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface DemoInstructionsProps {
  currentRole?: "admin" | "user" | null
}

export default function DemoInstructions({ currentRole = null }: DemoInstructionsProps) {
  const adminFeatures = [
    {
      icon: BarChart3,
      title: "Dashboard",
      description: "Tổng quan hệ thống với thống kê và biểu đồ",
      path: "/admin/dashboard",
    },
    {
      icon: FileText,
      title: "Quản lý bài viết",
      description: "Tạo, sửa, xóa bài viết và quản lý nội dung",
      path: "/admin/posts",
    },
    {
      icon: Eye,
      title: "Thống kê chi tiết",
      description: "Xem báo cáo lượt xem và phân tích dữ liệu",
      path: "/admin/stats",
    },
    {
      icon: Settings,
      title: "Quản lý tài liệu",
      description: "Upload và quản lý ebooks, dữ liệu mẫu",
      path: "/admin/documents",
    },
  ]

  const userFeatures = [
    {
      icon: Eye,
      title: "Xem nội dung",
      description: "Đọc bài viết, tải ebooks và dữ liệu mẫu",
      path: "/",
    },
    {
      icon: FileText,
      title: "Tải tài liệu",
      description: "Download các tài liệu được phép",
      path: "/ebooks",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header currentRole={currentRole} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">🎯 Hướng dẫn Demo</h1>
            <p className="text-xl text-gray-600">Trải nghiệm hệ thống với 2 role khác nhau để đánh giá giao diện</p>
          </div>

          {/* Current Role Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentRole === "admin" ? (
                  <Shield className="h-5 w-5" />
                ) : currentRole === "user" ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
                Trạng thái hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium">
                    Role:{" "}
                    <Badge
                      variant={currentRole === "admin" ? "default" : currentRole === "user" ? "secondary" : "outline"}
                    >
                      {currentRole === "admin" ? "Admin" : currentRole === "user" ? "User" : "Chưa đăng nhập"}
                    </Badge>
                  </p>
                  <p className="text-gray-600 mt-1">
                    {currentRole === "admin"
                      ? "Có quyền truy cập tất cả chức năng CMS"
                      : currentRole === "user"
                        ? "Chỉ có thể xem nội dung công khai"
                        : "Sử dụng Role Switcher ở góc phải trên để chọn role"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              Chức năng Admin
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {adminFeatures.map((feature, index) => (
                <Card key={index} className={currentRole !== "admin" ? "opacity-50" : ""}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentRole === "admin" ? (
                      <Link href={feature.path}>
                        <Button className="w-full">Truy cập ngay</Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full">
                        Cần role Admin
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* User Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-green-600" />
              Chức năng User
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {userFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-green-600" />
                      {feature.title}
                    </CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={feature.path}>
                      <Button variant="outline" className="w-full bg-transparent">
                        Truy cập ngay
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Testing Scenarios */}
          <Card>
            <CardHeader>
              <CardTitle>🧪 Kịch bản test giao diện</CardTitle>
              <CardDescription>Các bước để đánh giá đầy đủ hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">1. Test với role Admin:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Chuyển sang role "Admin" bằng Role Switcher</li>
                    <li>• Truy cập Dashboard để xem tổng quan</li>
                    <li>• Thử tạo bài viết mới trong "Quản lý bài viết"</li>
                    <li>• Xem thống kê chi tiết và biểu đồ</li>
                    <li>• Kiểm tra quản lý liên hệ và tài liệu</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">2. Test với role User:</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Chuyển sang role "User"</li>
                    <li>• Thử truy cập /admin/* để xem trang 403</li>
                    <li>• Duyệt nội dung công khai (SPSS, Blog, Ebooks)</li>
                    <li>• Test form liên hệ</li>
                    <li>• Kiểm tra responsive trên mobile</li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">3. Điểm cần góp ý:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Màu sắc và typography có phù hợp không?</li>
                    <li>• Navigation có dễ sử dụng không?</li>
                    <li>• Responsive design trên mobile như thế nào?</li>
                    <li>• Loading states và animations có mượt không?</li>
                    <li>• UX flow có logic và trực quan không?</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
