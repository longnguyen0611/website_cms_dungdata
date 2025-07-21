"use client"

import Link from "next/link"
import { Calendar, Eye } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface PostCardProps {
  id: string
  title: string
  description: string
  category: string
  date: string
  views?: number
  slug: string
  thumbnail?: string
  price?: number
}

export default function PostCard({
  id,
  title,
  description,
  category,
  date,
  views,
  slug,
  thumbnail,
  price
}: PostCardProps) {
  return (
    <Card className="card-hover h-full flex flex-col justify-between">
      <CardHeader className="p-0">
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover rounded-t-lg" />
          ) : (
            <div className="text-primary/40 text-4xl font-bold">{title.charAt(0)}</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">{category}</Badge>
        </div>
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

        {typeof price === "number" && price > 0 && (
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-semibold text-primary">
              {price.toLocaleString("vi-VN")}₫
            </p>
            <AddToCartButton postId={id} />
          </div>
        )}

      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
          {views && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {views}
            </div>
          )}
        </div>
        <Link href={`/post/${slug}`} className="text-primary hover:text-primary/80 font-medium text-sm">
          Xem chi tiết →
        </Link>
      </CardFooter>
    </Card>
  )
}
