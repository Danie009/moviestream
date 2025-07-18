"use client"

import type React from "react"
// import { ProtectedRoute } from "@/components/protected-route" // Removed ProtectedRoute
import { MovieHeader } from "@/components/movie-header"
import "./movies.css"

export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Removed ProtectedRoute wrapper to allow unauthenticated access
    <div className="min-h-screen bg-background">
      <MovieHeader />
      {children}
    </div>
  )
}
