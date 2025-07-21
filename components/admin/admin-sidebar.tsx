"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Eye,
  Mail,
  BookOpen,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Home,
  FolderOpen,
  CheckCircle,
  Image,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Bài viết", href: "/admin/posts", icon: FileText },
  { name: "Chuyên mục", href: "/admin/categories", icon: FolderOpen },
  { name: "Thống kê", href: "/admin/stats", icon: Eye },
  { name: "Liên hệ", href: "/admin/contacts", icon: Mail },
  { name: "Tài liệu", href: "/admin/documents", icon: BookOpen },
  { name: "Quản lý hình ảnh", href: "/admin/images", icon: Image },
  { name: "Người dùng", href: "/admin/users", icon: Users },
  { name: "Xác nhận thanh toán", href: "/admin/orders", icon: CheckCircle }, // ✅ thêm mục này
  { name: "Cấu hình", href: "/admin/settings", icon: Settings },
]


interface AdminSidebarProps {
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export default function AdminSidebar({ collapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("user_role")
    window.location.href = "/admin/login"
  }

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white shadow-lg border-r transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              D
            </div>
            <span className="text-xl font-bold text-primary">Admin</span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold mx-auto">
            D
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="hidden lg:flex">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn("w-full justify-start", collapsed ? "px-2" : "px-3")}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className={cn("h-5 w-5", !collapsed && "mr-3")} />
                  {!collapsed && item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-full p-3 border-t">
        <Link href="/">
          <Button
            variant="ghost"
            className={cn("w-full justify-start text-gray-600 hover:text-gray-900", collapsed ? "px-2" : "px-3")}
            title={collapsed ? "Về trang chủ" : undefined}
          >
            <Home className={cn("h-5 w-5", !collapsed && "mr-3")} />
            {!collapsed && "Về trang chủ"}
          </Button>
        </Link>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            collapsed ? "px-2" : "px-3",
          )}
          title={collapsed ? "Đăng xuất" : undefined}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-5 w-5", !collapsed && "mr-3")} />
          {!collapsed && "Đăng xuất"}
        </Button>
      </div>
    </div>
  )
}
