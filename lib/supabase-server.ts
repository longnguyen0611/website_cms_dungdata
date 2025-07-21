import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function createSupabaseServerClient() {
  const cookieStore = await cookies() // ✅ await để lấy cookies thực sự

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {
          // Không cần xử lý nếu không set cookie
        },
        remove() {
          // Không cần xử lý nếu không xóa cookie
        }
      }
    }
  )
}
