"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, Heart, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase" // 👈 Import Supabase client

const inspirationalQuotes = [
  {
    text: "Học tập là hành trình không có điểm dừng. Hẹn gặp lại bạn sớm nhất!",
    author: "Dũng Data Team",
  },
  {
    text: "Dữ liệu là dầu mỏ của thế kỷ 21. Hãy tiếp tục khai thác tri thức!",
    author: "Clive Humby",
  },
  {
    text: "Trong thống kê, chúng ta tin tưởng. Tất cả những gì khác phải có bằng chứng.",
    author: "W. Edwards Deming",
  },
  {
    text: "Kiến thức là sức mạnh. Thông tin là giải phóng. Giáo dục là tiền đề của tiến bộ.",
    author: "Kofi Annan",
  },
  {
    text: "Phân tích dữ liệu là nghệ thuật tìm ra câu chuyện mà dữ liệu muốn kể.",
    author: "Unknown",
  },
  {
    text: "Không có gì thay thế được sự chăm chỉ và kiên trì trong nghiên cứu.",
    author: "Marie Curie",
  },
  {
    text: "SPSS không chỉ là công cụ, mà là cầu nối giữa dữ liệu và hiểu biết.",
    author: "Dũng Data",
  },
  {
    text: "Mỗi dataset đều có một câu chuyện. Nhiệm vụ của chúng ta là lắng nghe.",
    author: "Hans Rosling",
  },
  {
    text: "Nghiên cứu khoa học là ánh sáng dẫn đường cho nhân loại tiến bộ.",
    author: "Albert Einstein",
  },
  {
    text: "Cảm ơn bạn đã tin tưởng Dũng Data. Chúc bạn thành công trên con đường học tập!",
    author: "Dũng Data Team",
  },
]

export default function LogoutPage() {
  const router = useRouter()
  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0])
  const [isLoggingOut, setIsLoggingOut] = useState(true)

  useEffect(() => {
    const randomQuote =
      inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]
    setCurrentQuote(randomQuote)

    const logoutProcess = async () => {
      // ✅ Thực hiện đăng xuất thật sự khỏi Supabase
      await supabase.auth.signOut()

      // ✅ Xóa các thông tin localStorage nếu có dùng
      localStorage.removeItem("admin_token")
      localStorage.removeItem("user_token")
      localStorage.removeItem("user_role")
      localStorage.removeItem("user_data")

      // Hiệu ứng loading
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsLoggingOut(false)
    }

    logoutProcess()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {isLoggingOut ? (
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <LogOut className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full animate-pulse"
                      style={{ animation: "loading 2s ease-in-out" }}
                    ></div>
                  </div>
                  <p className="text-gray-600 animate-pulse">Đang đăng xuất...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <div className="text-white text-4xl">✨</div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tạm biệt!</h1>
                <p className="text-gray-600">Bạn đã đăng xuất thành công khỏi Dũng Data</p>
              </div>
            </div>

            <Card className="shadow-xl border-0 bg-gradient-to-r from-primary/5 to-purple/5 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">💡</div>
                <blockquote className="text-lg text-gray-700 italic leading-relaxed mb-4">
                  "{currentQuote.text}"
                </blockquote>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>— {currentQuote.author}</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-2xl font-bold text-primary">156+</div>
                <div className="text-xs text-gray-600">Bài viết SPSS</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-2xl font-bold text-green-600">24+</div>
                <div className="text-xs text-gray-600">Ebooks chất lượng</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="text-2xl font-bold text-purple-600">50+</div>
                <div className="text-xs text-gray-600">Dữ liệu mẫu</div>
              </div>
            </div>

            <div className="space-y-4">
              <Link href="/">
                <Button
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                  size="lg"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Về trang chủ
                </Button>
              </Link>

              <div className="flex space-x-3">
                <Link href="/login" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5"
                  >
                    Đăng nhập lại
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5"
                  >
                    Đăng ký mới
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-500">Cảm ơn bạn đã sử dụng Dũng Data! 🙏</p>
              <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
                <span>Được phát triển với</span>
                <Heart className="h-3 w-3 text-red-500" />
                <span>bởi phòng CNTT (VSM)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
