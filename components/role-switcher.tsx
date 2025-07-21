"use client"
import { User, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RoleSwitcherProps {
  onRoleChange: (role: "admin" | "user" | null) => void
  currentRole: "admin" | "user" | null
}

export default function RoleSwitcher({ onRoleChange, currentRole }: RoleSwitcherProps) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-64 shadow-lg border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Demo Role Switcher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-gray-600 mb-3">Chọn role để trải nghiệm giao diện:</div>

          <div className="space-y-2">
            <Button
              variant={currentRole === "admin" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onRoleChange("admin")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin
              {currentRole === "admin" && (
                <Badge className="ml-auto" variant="secondary">
                  Active
                </Badge>
              )}
            </Button>

            <Button
              variant={currentRole === "user" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onRoleChange("user")}
            >
              <User className="mr-2 h-4 w-4" />
              User
              {currentRole === "user" && (
                <Badge className="ml-auto" variant="secondary">
                  Active
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700"
              onClick={() => onRoleChange(null)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>

          {currentRole && (
            <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
              <strong>Quyền hiện tại:</strong>
              <br />
              {currentRole === "admin" ? (
                <>
                  ✅ Truy cập /admin/*
                  <br />✅ Quản lý nội dung
                  <br />✅ Xem thống kê
                  <br />✅ Quản lý người dùng
                </>
              ) : (
                <>
                  ❌ Không truy cập /admin/*
                  <br />✅ Xem nội dung công khai
                  <br />✅ Tải tài liệu
                  <br />✅ Gửi liên hệ
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
