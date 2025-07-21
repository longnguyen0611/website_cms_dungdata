"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Eye } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"

export default function CreatePostPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    subcategory: "",
    description: "",
    content: "",
    thumbnail: "",
    published: false,
    views: 0,
    price: 0,
  })

  const router = useRouter()

  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return router.push("/login")

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role !== "admin") {
        alert("Bạn không có quyền truy cập.")
        router.push("/")
      }
    }

    checkRole()
  }, [router])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error } = await supabase.storage
      .from("image")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (error) {
      alert("Lỗi upload ảnh: " + error.message)
      return
    }

    const { data: urlData } = supabase.storage.from("image").getPublicUrl(filePath)

    if (!urlData.publicUrl) {
      alert("Không lấy được URL công khai cho ảnh.")
      return
    }

    setFormData((prev) => ({ ...prev, thumbnail: urlData.publicUrl }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      title,
      slug,
      category,
      subcategory,
      description,
      content,
      thumbnail,
      published,
      views,
      price,
    } = formData

    const { error } = await supabase.from("posts").insert([
      {
        title,
        slug,
        category,
        subcategory: category === "data" ? subcategory : null,
        excerpt: description,
        content,
        thumbnail_url: thumbnail,
        is_featured: published,
        views,
        price,
      },
    ])

    if (error) {
      alert("Tạo bài viết thất bại: " + error.message)
    } else {
      alert("Tạo bài viết thành công!")
      router.push("/admin/posts")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <AdminHeader
          title="Tạo bài viết mới"
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="p-6">
          <Link
            href="/admin/posts"
            className="inline-flex items-center text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách bài viết
          </Link>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cột 1-2: nội dung chính */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                    <CardDescription>
                      Nhập thông tin cơ bản của bài viết
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tiêu đề *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="Nhập tiêu đề bài viết..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, slug: e.target.value }))
                        }
                        placeholder="duong-dan-bai-viet"
                      />
                      <p className="text-xs text-gray-500">
                        URL: /post/{formData.slug || "duong-dan-bai-viet"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả ngắn *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Mô tả ngắn gọn về nội dung bài viết..."
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="views">Lượt xem ban đầu</Label>
                      <Input
                        id="views"
                        type="number"
                        min={0}
                        value={formData.views}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            views: Number(e.target.value),
                          }))
                        }
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Giá bán (VNĐ)</Label>
                      <div className="relative">
                        <Input
                          id="price"
                          type="number"
                          min={0}
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              price: Number(e.target.value),
                            }))
                          }
                          placeholder="0"
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          VNĐ
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nội dung bài viết</CardTitle>
                    <CardDescription>
                      Viết nội dung chi tiết của bài viết
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="content">Nội dung *</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="Viết nội dung bài viết ở đây... (Hỗ trợ Markdown)"
                        rows={15}
                        className="font-mono"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Hỗ trợ Markdown: **bold**, *italic*, `code`, ## heading,
                        etc.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Cột 3: tùy chọn */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Xuất bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="published">Xuất bản ngay</Label>
                      <Switch
                        id="published"
                        checked={formData.published}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            published: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1">
                        {formData.published ? "Xuất bản" : "Lưu nháp"}
                      </Button>
                      <Button type="button" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Chuyên mục</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chuyên mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="data">Dữ liệu</SelectItem>
                        <SelectItem value="Ebook">Ebook</SelectItem>
                        <SelectItem value="SPSS">SPSS</SelectItem>
                        <SelectItem value="Blog">Blog</SelectItem>
                      </SelectContent>
                    </Select>

                    {formData.category === "data" && (
                      <>
                        <Label htmlFor="subcategory">Loại dữ liệu</Label>
                        <Select
                          value={formData.subcategory}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              subcategory: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại dữ liệu" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SPSS">SPSS</SelectItem>
                            <SelectItem value="Stata">Stata</SelectItem>
                            <SelectItem value="SmartPLS">SmartPLS</SelectItem>
                          </SelectContent>
                        </Select>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ảnh đại diện</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    {formData.thumbnail && (
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail"
                        className="rounded-lg w-full mt-2"
                      />
                    )}
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF tối đa 2MB. Tự động lưu vào bucket `image`.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
