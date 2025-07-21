import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { supabase } from "@/lib/supabase"

interface PostFormProps {
  post?: Partial<Post>
  onSubmit: (data: Partial<Post>) => Promise<void>
  loading?: boolean
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  category: string
  subcategory: string
  price: number
  view: number
}

export default function PostForm({ post, onSubmit, loading }: PostFormProps) {
  const [formData, setFormData] = useState<Partial<Post>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    category: "",
    subcategory: "",
    price: 0,
    view: 0,
    ...post,
  })

  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: generateSlug(prev.title ?? "") }))
    }
  }, [formData.title])

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim()
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const filePath = `thumbnails/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("image").upload(filePath, file)

    if (error) {
      console.error("Lỗi tải ảnh:", error.message)
      return
    }

    const publicUrl = supabase.storage.from("image").getPublicUrl(filePath).data.publicUrl
    setFormData((prev) => ({ ...prev, thumbnail: publicUrl }))
  }

  const handleChange = (field: keyof Post, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Tiêu đề</Label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Slug</Label>
        <Input value={formData.slug} readOnly />
      </div>

      <div>
        <Label>Giới thiệu ngắn</Label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => handleChange("excerpt", e.target.value)}
        />
      </div>

      <div>
        <Label>Nội dung chính</Label>
        <Textarea
          rows={10}
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
        />
      </div>

      <div>
        <Label>Ảnh đại diện</Label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        {formData.thumbnail && (
          <Image
            src={formData.thumbnail}
            alt="Thumbnail"
            width={200}
            height={120}
            className="mt-2 rounded-md border"
          />
        )}
      </div>

      <div>
        <Label>Chuyên mục</Label>
        <Input
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />
      </div>

      {formData.category === "data" && (
        <div>
          <Label>Danh mục con</Label>
          <Input
            value={formData.subcategory}
            onChange={(e) => handleChange("subcategory", e.target.value)}
          />
        </div>
      )}

      <div>
        <Label>Giá bán (VNĐ)</Label>
        <Input
          type="number"
          value={formData.price ?? 0}
          onChange={(e) => handleChange("price", Number(e.target.value))}
        />
      </div>

      <div>
        <Label>Lượt xem</Label>
        <Input
          type="number"
          value={formData.view ?? 0}
          onChange={(e) => handleChange("view", Number(e.target.value))}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu bài viết"}
      </Button>
    </form>
  )
}
