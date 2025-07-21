"use client"

import { useState } from "react"
import { FileText, Eye, Mail, BookOpen, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import StatsCard from "@/components/admin/stats-card"
import AuthCheck from "@/components/admin/auth-check"

// Mock data
const stats = [
  {
    title: "Tổng bài viết",
    value: "156",
    icon: FileText,
    color: "text-blue-600",
    trend: { value: 12, isPositive: true },
  },
  {
    title: "Lượt xem hôm nay",
    value: "2,847",
    icon: Eye,
    color: "text-green-600",
    trend: { value: 8, isPositive: true },
  },
  {
    title: "Tổng Ebooks",
    value: "24",
    icon: BookOpen,
    color: "text-purple-600",
    trend: { value: 4, isPositive: true },
  },
  {
    title: "Thư liên hệ",
    value: "18",
    icon: Mail,
    color: "text-orange-600",
    trend: { value: 2, isPositive: false },
  },
]

const quickStats = [
  { label: "Người dùng hoạt động", value: "1,234", change: "+12%" },
  { label: "Tổng downloads", value: "5,678", change: "+23%" },
  { label: "Đánh giá trung bình", value: "4.8/5", change: "+0.2" },
  { label: "Tỷ lệ hoàn thành", value: "89%", change: "+5%" },
]

const topPosts = [
  {
    id: 1,
    title: "Hướng dẫn phân tích hồi quy tuyến tính với SPSS",
    category: "SPSS",
    views: 3250,
    trend: "up",
  },
  {
    id: 2,
    title: "Kiểm định độ tin cậy Cronbach's Alpha",
    category: "SPSS",
    views: 2890,
    trend: "up",
  },
  {
    id: 3,
    title: "Phân tích nhân tố khám phá EFA",
    category: "SPSS",
    views: 2650,
    trend: "down",
  },
  {
    id: 4,
    title: "Ebook: Nghiên cứu định lượng trong khoa học xã hội",
    category: "Ebook",
    views: 2100,
    trend: "up",
  },
  {
    id: 5,
    title: "Bộ dữ liệu khảo sát hành vi tiêu dùng",
    category: "Dữ liệu mẫu",
    views: 1890,
    trend: "up",
  },
]

const recentActivities = [
  {
    action: "Bài viết mới được tạo",
    details: "Hướng dẫn sử dụng AMOS cho SEM",
    time: "2 giờ trước",
    type: "create",
  },
  {
    action: "Thư liên hệ mới",
    details: "Từ nguyenvana@email.com",
    time: "4 giờ trước",
    type: "contact",
  },
  {
    action: "Ebook được tải xuống",
    details: "Nghiên cứu định lượng - 15 lượt tải",
    time: "6 giờ trước",
    type: "download",
  },
  {
    action: "Bài viết được cập nhật",
    details: "Phân tích hồi quy tuyến tính",
    time: "1 ngày trước",
    type: "update",
  },
]

const viewsData = [
  { day: "T2", views: 1200 },
  { day: "T3", views: 1450 },
  { day: "T4", views: 1100 },
  { day: "T5", views: 1800 },
  { day: "T6", views: 2200 },
  { day: "T7", views: 1900 },
  { day: "CN", views: 1600 },
]

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Dashboard" sidebarCollapsed={sidebarCollapsed} />

          <main className="p-6">
            {/* Welcome Message */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
                <h2 className="text-3xl font-bold mb-2">👋 Chào mừng trở lại, Admin!</h2>
                <p className="text-blue-100">Tổng quan hoạt động hệ thống Dũng Data hôm nay</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3">
                      <div className="text-sm text-blue-100">{stat.label}</div>
                      <div className="text-xl font-bold">{stat.value}</div>
                      <div className="text-xs text-green-200">{stat.change}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Views Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Lượt xem 7 ngày qua</CardTitle>
                  <CardDescription>Biểu đồ lượt xem theo ngày</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {viewsData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-8">{item.day}</span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all duration-300"
                              style={{ width: `${(item.views / 2500) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 w-16 text-right">{item.views.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <CardDescription>Các hoạt động mới nhất trên hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            activity.type === "create"
                              ? "bg-green-500"
                              : activity.type === "contact"
                                ? "bg-blue-500"
                                : activity.type === "download"
                                  ? "bg-purple-500"
                                  : "bg-orange-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600 truncate">{activity.details}</p>
                          <p className="text-xs text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Posts */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top 5 bài viết được xem nhiều nhất</CardTitle>
                    <CardDescription>Bài viết có lượt xem cao nhất trong tháng</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Xem tất cả
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Chuyên mục</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Xu hướng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPosts.map((post, index) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate font-medium">{post.title}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{post.category}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{post.views.toLocaleString()}</TableCell>
                        <TableCell>
                          {post.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
