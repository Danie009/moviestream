"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireRole?: "admin" | "moderator" | "user"
  allowedRoles?: Array<"admin" | "moderator" | "user">
}

export function ProtectedRoute({ children, requireRole, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
      return
    }

    if (!loading && user) {
      // Check role-based access
      if (requireRole && user.role !== requireRole) {
        // Redirect based on user role
        if (user.role === "admin" || user.role === "moderator") {
          router.push("/dashboard")
        } else {
          router.push("/movies")
        }
        return
      }

      if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        if (user.role === "admin" || user.role === "moderator") {
          router.push("/dashboard")
        } else {
          router.push("/movies")
        }
        return
      }
    }
  }, [user, loading, router, requireRole, allowedRoles])

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return null
  }

  // Check role access
  if (requireRole && user.role !== requireRole) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
