"use client"

import Link from "next/link"
import { Shield, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ForbiddenPageProps {
  currentRole?: "admin" | "user" | null
}

export default function ForbiddenPage({ currentRole = null }: ForbiddenPageProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Không có quyền truy cập</h2>

          {/* Demo explanation */}
          <Card className="mb-6 text-left">
            <CardHeader>
              <CardTitle className="text-lg">🎯 Demo Explanation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Role hiện tại:</strong> {currentRole || "Chưa đăng nhập"}
              </p>
              <p>
                <strong>Trang yêu cầu:</strong> Admin role
              </p>
              <div className="mt-3 p-2 bg-yellow-50 rounded">
                <p className="text-yellow-800">
                  💡 <strong>Hướng dẫn:</strong> Sử dụng Role Switcher ở góc phải trên để chuyển sang role "Admin" và
                  truy cập được vào trang quản trị.
                </p>
              </div>
            </CardContent>
          </Card>

          <p className="text-gray-600 mb-8">
            Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản Admin hoặc liên hệ quản trị viên.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Trở về trang chủ
            </Button>
          </Link>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang trước
          </Button>
          <Link href="/contact">
            <Button variant="outline" className="w-full bg-transparent">
              Liên hệ hỗ trợ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
