"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Plus, Info, Star, Sparkles } from "lucide-react"
import type { Movie } from "@/lib/types"
import Link from "next/link"

interface HeroSectionProps {
  movies: Movie[]
}

export function HeroSection({ movies }: HeroSectionProps) {
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)

  // Get the 6 most recently added streaming movies
  const recentMovies = movies
    .filter((movie) => movie.isStreaming)
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 6)

  const currentMovie = recentMovies[currentMovieIndex] || movies[0]

  // Auto-rotate through movies every 8 seconds
  useEffect(() => {
    if (recentMovies.length <= 1) return

    const interval = setInterval(() => {
      setCurrentMovieIndex((prevIndex) => (prevIndex + 1) % recentMovies.length)
    }, 8000) // Change every 8 seconds

    return () => clearInterval(interval)
  }, [recentMovies.length])

  // Check if movie is new (less than 2 weeks old)
  const isNewMovie = (movie: Movie) => {
    const now = new Date()
    const twoWeeksAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const movieDate = new Date(movie.dateAdded)
    return movieDate > twoWeeksAgo
  }

  if (!currentMovie) return null

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      <Image
        src={currentMovie.backdrop || "/placeholder.svg"}
        alt={currentMovie.title}
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
        {/* New Badge */}
        {isNewMovie(currentMovie) && (
          <div className="mb-4">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-3 py-1">
              <Sparkles className="h-4 w-4 mr-1" />
              NEW ON MOVIESTREAM
            </Badge>
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{currentMovie.title}</h1>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-white font-medium">{currentMovie.rating}</span>
          </div>
          <span className="text-white">{currentMovie.releaseYear}</span>
          <span className="text-white">
            {Math.floor(currentMovie.duration / 60)}h {currentMovie.duration % 60}m
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {currentMovie.genre.slice(0, 3).map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
        </div>

        <p className="text-white/90 text-lg mb-6 line-clamp-3">{currentMovie.description}</p>

        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href={`/movies/watch/${currentMovie.id}`}>
              <Play className="h-5 w-5 mr-2" />
              Play Now
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            <Plus className="h-5 w-5 mr-2" />
            My List
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href={`/movies/${currentMovie.id}`}>
              <Info className="h-5 w-5 mr-2" />
              More Info
            </Link>
          </Button>
        </div>

        {/* Movie Indicators */}
        {recentMovies.length > 1 && (
          <div className="flex gap-2 mt-6">
            {recentMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMovieIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMovieIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
