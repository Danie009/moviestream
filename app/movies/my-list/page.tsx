"use client"

import { useState, useEffect } from "react"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { movieService } from "@/lib/movie-service"
import { Heart, Plus } from "lucide-react"
import Link from "next/link"
import type { Movie } from "@/lib/types"

export default function MyListPage() {
  const [savedMovies, setSavedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSavedMovies = async () => {
      try {
        // Get a few popular movies as placeholder for saved movies
        const movies = await movieService.getStreamingMovies({ category: "popular" })
        setSavedMovies(movies.slice(0, 6))
      } catch (error) {
        console.error("Error loading saved movies:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSavedMovies()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-2" />
          <div className="h-4 bg-gray-200 animate-pulse rounded w-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-64 h-96 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My List</h1>
        <p className="text-muted-foreground">Movies you've saved to watch later</p>
      </div>

      {savedMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {savedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} size="small" />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your list is empty</h2>
          <p className="text-muted-foreground mb-6">
            Start adding movies to your list to keep track of what you want to watch.
          </p>
          <Button asChild>
            <Link href="/movies/browse">
              <Plus className="h-4 w-4 mr-2" />
              Browse Movies
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
