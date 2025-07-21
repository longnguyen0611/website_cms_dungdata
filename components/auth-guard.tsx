"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user"
  currentRole: "admin" | "user" | null
}

export default function AuthGuard({ children, requiredRole, currentRole }: AuthGuardProps) {
  const router = useRouter()

  useEffect(() => {
    if (requiredRole === "admin" && currentRole !== "admin") {
      router.push("/403")
    }
  }, [requiredRole, currentRole, router])

  if (requiredRole === "admin" && currentRole !== "admin") {
    return null
  }

  return <>{children}</>
}
