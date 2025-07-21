"use client"

import { useEffect, useState } from "react"
import { Trash2, Upload, Copy } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import AuthCheck from "@/components/admin/auth-check"

export default function AdminImagesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const fetchImages = async () => {
    const { data, error } = await supabase.storage.from("image").list("", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    })
    if (error) {
      console.error("Lỗi khi tải danh sách ảnh:", error)
    } else {
      setImages(data?.map((item) => item.name) || [])
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fileName = `${Date.now()}_${file.name}`
    const { error } = await supabase.storage.from("image").upload(fileName, file)
    if (error) alert("Upload thất bại: " + error.message)
    else await fetchImages()
    setUploading(false)
  }

  const handleDelete = async (name: string) => {
    const confirmed = window.confirm("Xóa ảnh này?")
    if (!confirmed) return
    const { error } = await supabase.storage.from("image").remove([name])
    if (error) alert("Xóa thất bại: " + error.message)
    else await fetchImages()
  }

  const handleCopyLink = (name: string) => {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/image/${name}`
    navigator.clipboard.writeText(url)
    alert("Đã sao chép link: " + url)
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <div className={`transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Quản lý hình ảnh" sidebarCollapsed={sidebarCollapsed} />

          <main className="p-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Thư viện ảnh</CardTitle>
                  <CardDescription>Upload, xóa và lấy link ảnh</CardDescription>
                </div>
                <Input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((name) => (
                    <div key={name} className="relative border rounded overflow-hidden group">
                      <img
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/image/${name}`}
                        alt={name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Button size="icon" variant="secondary" onClick={() => handleCopyLink(name)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDelete(name)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
