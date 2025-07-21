export const dynamic = "force-dynamic"
export const dynamicParams = true

import { Calendar, Eye, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PostCard from "@/components/post-card"
import ReactMarkdown from "react-markdown"
import { AddToCartButton } from "@/components/add-to-cart-button"
type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function PostDetailPage({ params }: PageProps) {
  // ✅ Await params before using its properties
  const { slug } = await params

  // Lấy bài viết chi tiết
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!post || error) {
    notFound()
  }

  // Lấy các bài viết liên quan
  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, category, created_at, views, thumbnail_url, price")
    .eq("category", post.category)
    .neq("slug", slug)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <Link
          href={`/${post.category.toLowerCase()}`}
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại {post.category}
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{post.category}</Badge>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

         {typeof post.price === "number" && post.price > 0 && (
            <div className="flex items-stretch gap-4 mb-6">
              <div className="text-2xl font-semibold text-primary flex items-center">
                {post.price.toLocaleString("vi-VN")}₫
              </div>
              <AddToCartButton postId={post.id} />
            </div>
          )}


          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Dũng Data
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.created_at).toLocaleDateString("vi-VN")}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {post.views?.toLocaleString()} lượt xem
            </div>
          </div>
        </header>

        {post.thumbnail_url ? (
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="w-full rounded-lg mb-8 aspect-video object-cover"
          />
        ) : (
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg mb-8 flex items-center justify-center">
            <div className="text-primary/40 text-6xl font-bold">📊</div>
          </div>
        )}
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>


        {/* Bài viết liên quan */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Bài viết liên quan</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <PostCard
                  key={rp.slug}
                  id={rp.id} // ✅ cần thiết để addToCart
                  title={rp.title}
                  description={rp.excerpt}
                  category={rp.category}
                  date={new Date(rp.created_at).toLocaleDateString("vi-VN")}
                  views={rp.views}
                  slug={rp.slug}
                  thumbnail={rp.thumbnail_url}
                  price={rp.price}
                />
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </div>
  )
}

// Không tạo static page → dynamic rendering
export async function generateStaticParams() {
  return []
}