"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthRedirectProps {
  children: React.ReactNode
}

export function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if user is already authenticated
    if (!loading && user) {
      if (user.role === "admin" || user.role === "moderator") {
        router.push("/dashboard")
      } else {
        router.push("/movies")
      }
    }
  }, [user, loading, router])

  // Show the page content (don't redirect if not authenticated)
  return <>{children}</>
}
