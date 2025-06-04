"use client"

import { useState } from "react"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { moviesData } from "@/lib/movies-data"
import { Heart, Plus } from "lucide-react"
import Link from "next/link"

export default function MyListPage() {
  // Mock user's saved movies - in real app this would come from database
  const [savedMovies] = useState(moviesData.slice(0, 3))

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
