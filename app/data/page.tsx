"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PostCard from "@/components/post-card"
import { supabase } from "@/lib/supabase"

const SUBCATEGORIES = ["Tất cả", "SPSS", "Stata", "SmartPLS"]

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail_url: string
  category: string
  subcategory: string
  post_type: string
  is_featured: boolean
  views: number
  likes: number
  created_at: string
  price?: number
}

export default function DataPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedSub, setSelectedSub] = useState<string>("Tất cả")

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)

      let query = supabase
        .from("posts")
        .select("*")
        .eq("category", "data")
        .order("created_at", { ascending: false })

      if (selectedSub !== "Tất cả") {
        query = query.eq("subcategory", selectedSub)
      }

      const { data, error } = await query

      if (error) {
        console.error("Lỗi khi tải dữ liệu:", error)
        setPosts([])
      } else {
        setPosts(data ?? [])
      }

      setLoading(false)
    }

    fetchPosts()
  }, [selectedSub])

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dữ liệu mẫu</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bộ sưu tập dữ liệu chất lượng cao dành cho thực hành phân tích thống kê, nghiên cứu khoa học và học tập.
          </p>
        </div>

        {/* 🔽 Bộ lọc subcategory */}
        <div className="flex justify-center md:justify-end mb-8">
          <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1">
            {SUBCATEGORIES.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSub(sub)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                  selectedSub === sub
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Danh sách dữ liệu */}
        {loading ? (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">Không có dữ liệu phù hợp.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id} // ✅ cần để addToCart hoạt động đúng
                title={post.title}
                description={post.excerpt}
                category={post.category}
                date={new Date(post.created_at).toLocaleDateString("vi-VN")}
                views={post.views}
                slug={post.slug}
                thumbnail={post.thumbnail_url}
                price={post.price}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
