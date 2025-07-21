"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Eye, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import StatsCard from "@/components/admin/stats-card"
// Thêm AuthCheck wrapper
import AuthCheck from "@/components/admin/auth-check"

// Mock data
const weeklyViews = [
  { day: "Thứ 2", views: 1200, change: 5.2 },
  { day: "Thứ 3", views: 1450, change: 12.8 },
  { day: "Thứ 4", views: 1100, change: -8.4 },
  { day: "Thứ 5", views: 1800, change: 15.6 },
  { day: "Thứ 6", views: 2200, change: 22.3 },
  { day: "Thứ 7", views: 1900, change: 8.7 },
  { day: "Chủ nhật", views: 1600, change: -2.1 },
]

const topPosts = [
  {
    id: 1,
    title: "Hướng dẫn phân tích hồi quy tuyến tính với SPSS",
    category: "SPSS",
    views: 3250,
    uniqueViews: 2890,
    avgTime: "8:45",
    bounceRate: "32%",
  },
  {
    id: 2,
    title: "Kiểm định độ tin cậy Cronbach's Alpha",
    category: "SPSS",
    views: 2890,
    uniqueViews: 2456,
    avgTime: "6:32",
    bounceRate: "28%",
  },
  {
    id: 3,
    title: "Phân tích nhân tố khám phá EFA",
    category: "SPSS",
    views: 2650,
    uniqueViews: 2234,
    avgTime: "7:18",
    bounceRate: "35%",
  },
  {
    id: 4,
    title: "Ebook: Nghiên cứu định lượng trong khoa học xã hội",
    category: "Ebook",
    views: 2100,
    uniqueViews: 1876,
    avgTime: "12:34",
    bounceRate: "22%",
  },
  {
    id: 5,
    title: "Bộ dữ liệu khảo sát hành vi tiêu dùng",
    category: "Dữ liệu mẫu",
    views: 1890,
    uniqueViews: 1654,
    avgTime: "5:21",
    bounceRate: "41%",
  },
]

const categoryStats = [
  { category: "SPSS", views: 12450, posts: 45, avgViews: 276 },
  { category: "Ebook", views: 8900, posts: 24, avgViews: 371 },
  { category: "Dữ liệu mẫu", views: 6780, posts: 18, avgViews: 377 },
  { category: "Blog", views: 5430, posts: 32, avgViews: 170 },
]

// Wrap toàn bộ component trong AuthCheck
export default function AdminStatsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [timeRange, setTimeRange] = useState("7days")

  const totalViews = weeklyViews.reduce((sum, day) => sum + day.views, 0)
  const avgViews = Math.round(totalViews / weeklyViews.length)

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Thống kê" sidebarCollapsed={sidebarCollapsed} />

          <main className="p-6">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Báo cáo thống kê</h2>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 ngày qua</SelectItem>
                  <SelectItem value="30days">30 ngày qua</SelectItem>
                  <SelectItem value="3months">3 tháng qua</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Tổng lượt xem"
                value={totalViews.toLocaleString()}
                icon={Eye}
                color="text-blue-600"
                trend={{ value: 12.5, isPositive: true }}
              />
              <StatsCard
                title="Lượt xem trung bình"
                value={avgViews.toLocaleString()}
                icon={TrendingUp}
                color="text-green-600"
                trend={{ value: 8.3, isPositive: true }}
              />
              <StatsCard
                title="Bài viết mới"
                value="12"
                icon={FileText}
                color="text-purple-600"
                trend={{ value: 4.2, isPositive: true }}
              />
              <StatsCard
                title="Thời gian đọc TB"
                value="7:32"
                icon={Calendar}
                color="text-orange-600"
                trend={{ value: 2.1, isPositive: false }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Weekly Views Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Lượt xem theo ngày</CardTitle>
                  <CardDescription>Biểu đồ lượt xem 7 ngày qua</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyViews.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-20">{item.day}</span>
                        <div className="flex-1 mx-4">
                          <div className="bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-primary rounded-full h-3 transition-all duration-300"
                              style={{ width: `${(item.views / 2500) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium w-16 text-right">{item.views.toLocaleString()}</span>
                          <div
                            className={`flex items-center text-xs ${
                              item.change >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {item.change >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            {Math.abs(item.change)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê theo chuyên mục</CardTitle>
                  <CardDescription>Lượt xem và số bài viết theo từng chuyên mục</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryStats.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{item.category}</div>
                          <div className="text-sm text-gray-600">{item.posts} bài viết</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{item.views.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">TB: {item.avgViews}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Posts Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 bài viết được xem nhiều nhất</CardTitle>
                <CardDescription>Thống kê chi tiết về các bài viết phổ biến</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead>Chuyên mục</TableHead>
                      <TableHead>Lượt xem</TableHead>
                      <TableHead>Unique Views</TableHead>
                      <TableHead>Thời gian TB</TableHead>
                      <TableHead>Bounce Rate</TableHead>
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
                        <TableCell>{post.uniqueViews.toLocaleString()}</TableCell>
                        <TableCell>{post.avgTime}</TableCell>
                        <TableCell>
                          <span
                            className={`${
                              Number.parseInt(post.bounceRate) < 30
                                ? "text-green-600"
                                : Number.parseInt(post.bounceRate) < 40
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {post.bounceRate}
                          </span>
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
