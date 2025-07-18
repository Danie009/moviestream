"use client" // Added "use client" directive

import type React from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { MovieHeader } from "@/components/movie-header"
import "./movies.css"

export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={["user", "admin", "moderator"]}>
      <div className="min-h-screen bg-background">
        <MovieHeader />
        {children}
      </div>
    </ProtectedRoute>
  )
}
