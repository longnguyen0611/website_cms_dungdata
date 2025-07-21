"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PostCard from "@/components/post-card"
import { supabase } from "@/lib/supabase"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail_url: string
  category: string
  post_type: string
  is_featured: boolean
  views: number
  likes: number
  created_at: string
  price?: number
}

const PAGE_SIZE = 6

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchPosts = async (page: number) => {
    setLoading(true)

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error, count } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        content,
        thumbnail_url,
        category,
        post_type,
        is_featured,
        views,
        likes,
        created_at,
        price
        `,
        { count: "exact" }
      )
      .eq("category", "Blog")
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      console.error("Lỗi lấy bài viết:", error)
      setBlogPosts([])
    } else {
      setBlogPosts((data || []) as Post[])
      setTotalPosts(count || 0)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchPosts(currentPage)
  }, [currentPage])

  const totalPages = Math.ceil(totalPosts / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Tiêu đề trang */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chia sẻ kiến thức, kinh nghiệm và góc nhìn mới về nghiên cứu khoa học, phân tích dữ liệu và công nghệ.
          </p>
        </div>

        {/* Hiển thị nội dung */}
        {loading ? (
          <p className="text-center text-gray-500">Đang tải bài viết...</p>
        ) : blogPosts.length === 0 ? (
          <p className="text-center text-gray-500">Không có bài viết nào.</p>
        ) : (
          <>
            {/* Danh sách bài viết */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
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

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium border rounded-md ${
                        page === currentPage
                          ? "text-white bg-primary border-primary"
                          : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
