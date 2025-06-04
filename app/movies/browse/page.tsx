"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { movieService } from "@/lib/movie-service"
import type { Movie } from "@/lib/types"

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const initialGenre = searchParams.get("genre")
  const initialSort = searchParams.get("sort") as "title" | "year" | "rating" | null

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(initialGenre)
  const [sortBy, setSortBy] = useState<"title" | "year" | "rating">(initialSort || "title")
  const [streamingMovies, setStreamingMovies] = useState<Movie[]>([])

  // Filter movies to only show streaming ones
  const streamingMoviesFiltered = streamingMovies

  // Update the filteredMovies to use streamingMovies instead of moviesData:
  const filteredMovies = streamingMoviesFiltered
    .filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = !selectedGenre || movie.genre.includes(selectedGenre)
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "year":
          return b.releaseYear - a.releaseYear
        case "rating":
          return b.rating - a.rating
        default:
          return a.title.localeCompare(b.title)
      }
    })

  // Update allGenres to use streamingMovies:
  const allGenres = Array.from(new Set(streamingMoviesFiltered.flatMap((movie) => movie.genre)))

  // Set initial filters from URL params
  useEffect(() => {
    if (initialGenre) {
      setSelectedGenre(initialGenre)
    }
    if (initialSort) {
      setSortBy(initialSort)
    }
  }, [initialGenre, initialSort])

  useEffect(() => {
    const loadStreamingMovies = () => {
      const movies = movieService.getStreamingMovies()
      setStreamingMovies(movies)
    }

    // Listen for movie updates from dashboard
    const handleMoviesUpdate = () => {
      loadStreamingMovies()
    }

    window.addEventListener("moviesUpdated", handleMoviesUpdate)

    return () => {
      window.removeEventListener("moviesUpdated", handleMoviesUpdate)
    }
  }, [])

  useEffect(() => {
    const movies = movieService.getStreamingMovies()
    setStreamingMovies(movies)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Browse Movies</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button variant={sortBy === "title" ? "default" : "outline"} onClick={() => setSortBy("title")} size="sm">
              A-Z
            </Button>
            <Button variant={sortBy === "year" ? "default" : "outline"} onClick={() => setSortBy("year")} size="sm">
              Year
            </Button>
            <Button variant={sortBy === "rating" ? "default" : "outline"} onClick={() => setSortBy("rating")} size="sm">
              Rating
            </Button>
          </div>
        </div>

        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedGenre === null ? "default" : "outline"}
            onClick={() => setSelectedGenre(null)}
            size="sm"
          >
            All Genres
          </Button>
          {allGenres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              onClick={() => setSelectedGenre(genre)}
              size="sm"
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-muted-foreground">
          Showing {filteredMovies.length} movie{filteredMovies.length !== 1 ? "s" : ""}
          {selectedGenre && ` in ${selectedGenre}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-6">
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} size="small" />
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No movies found matching your criteria.</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setSelectedGenre(null)
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
