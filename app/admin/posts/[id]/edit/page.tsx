"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Eye } from "lucide-react"

import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import AuthCheck from "@/components/admin/auth-check"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail_url: string
  category: string
  subcategory: string
  price: number
  views: number
}

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [collapsed, setCollapsed] = useState(false)
  const [post, setPost] = useState<Post>({
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail_url: "",
    category: "Ebook",
    subcategory: "",
    price: 0,
    views: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase.from("posts").select("*").eq("id", id).single()
      if (error || !data) {
        console.error("Lỗi khi lấy bài viết:", error)
        return
      }
      setPost({
        ...data,
        price: data.price || 0,
        views: data.views || 0,
      })
    }
    fetchPost()
  }, [id])

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim()

  const handleChange = (key: keyof Post, value: any) =>
    setPost({ ...post, [key]: value })

  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title)
    setPost({ ...post, title, slug })
  }
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  // 1. Xoá file cũ nếu có
  if (post.thumbnail_url) {
    try {
      const url = new URL(post.thumbnail_url)
      const path = decodeURIComponent(url.pathname.split("/storage/v1/object/public/image/")[1])
      if (path) {
        await supabase.storage.from("image").remove([path])
      }
    } catch (error) {
      console.warn("Không thể xoá ảnh cũ:", error)
    }
  }

  // 2. Upload file mới
  const filePath = `${Date.now()}-${file.name}`
  const { error: uploadError } = await supabase.storage.from("image").upload(filePath, file)

  if (uploadError) {
    console.error("Lỗi tải ảnh:", uploadError.message)
    return
  }

  const { data } = supabase.storage.from("image").getPublicUrl(filePath)
  setPost({ ...post, thumbnail_url: data.publicUrl })
}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const updateData = {
      ...post,
      subcategory: post.category === "data" ? post.subcategory : "",
    }

    const { error } = await supabase.from("posts").update(updateData).eq("id", id)
    setLoading(false)

    if (error) {
      console.error("Lỗi khi cập nhật:", error)
    } else {
      router.push("/admin/posts")
    }
  }

  return (
    <AuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
        <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
          <AdminHeader title="Chỉnh sửa bài viết" sidebarCollapsed={collapsed} />
          <main className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/admin/posts"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách bài viết
              </Link>
              <Link href={`/post/${post.slug}`}>
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Xem bài viết
                </Button>
              </Link>
            </div>
            <Card className="mt-4">
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <Label className="text-base font-semibold mb-1">Tiêu đề</Label>
                    <Input value={post.title} onChange={(e) => handleTitleChange(e.target.value)} />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-1">Slug</Label>
                    <Input value={post.slug} readOnly />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-1">Mô tả ngắn</Label>
                    <Textarea value={post.excerpt} onChange={(e) => handleChange("excerpt", e.target.value)} />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-1">Nội dung</Label>
                    <Textarea rows={10} value={post.content} onChange={(e) => handleChange("content", e.target.value)} />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-1">Ảnh đại diện</Label>
                    <Input type="file" accept="image/*" onChange={handleImageUpload} />
                    {post.thumbnail_url && (
                      <Image
                        src={post.thumbnail_url}
                        alt="Thumbnail"
                        width={320}
                        height={180}
                        className="rounded-md border mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-1">Chuyên mục</Label>
                    <select
                      value={post.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="Ebook">Ebook</option>
                      <option value="data">Data</option>
                      <option value="SPSS">SPSS</option>
                      <option value="Blog">Blog</option>
                    </select>
                  </div>

                  {post.category === "data" && (
                    <div>
                      <Label className="text-base font-semibold mb-1">Danh mục con</Label>
                      <select
                        value={post.subcategory}
                        onChange={(e) => handleChange("subcategory", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="SPSS">SPSS</option>
                        <option value="Stata">Stata</option>
                        <option value="SmartPLS">SmartPLS</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <Label className="text-base font-semibold mb-1">Giá (VNĐ)</Label>
                    <Input
                      type="number"
                      value={post.price}
                      onChange={(e) => handleChange("price", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div>
                    <Label className="text-base font-semibold mb-1">Lượt xem</Label>
                    <Input
                      type="number"
                      value={post.views}
                      onChange={(e) => handleChange("views", parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Đang lưu..." : "Cập nhật bài viết"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </AuthCheck>
  )
}
