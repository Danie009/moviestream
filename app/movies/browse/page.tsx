"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { MovieCard } from "@/components/movie-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react" // Import Chevron icons
import { movieService } from "@/lib/movie-service"
import type { Movie } from "@/lib/types"

const allGenres = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi"] // Declare allGenres variable

function BrowseContent() {
  const searchParams = useSearchParams()
  const initialGenre = searchParams.get("genre")
  const initialSort = searchParams.get("sort") as "title" | "year" | "rating" | null
  const initialQuery = searchParams.get("query")
  const initialPage = Number.parseInt(searchParams.get("page") || "1", 10) // Get initial page from URL

  const [searchTerm, setSearchTerm] = useState(initialQuery || "")
  const [selectedGenre, setSelectedGenre] = useState<string | null>(initialGenre)
  const [sortBy, setSortBy] = useState<"title" | "year" | "rating">(initialSort || "title")
  const [streamingMovies, setStreamingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage) // State for current page
  const [totalPages, setTotalPages] = useState(1) // State for total pages from API
  const pageSize = 20 // Define page size

  const filteredMovies = streamingMovies // Declare filteredMovies variable

  // Load streaming movies based on search term, genre, sort, and page
  useEffect(() => {
    const loadStreamingMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        const { movies, totalPages: apiTotalPages } = await movieService.fetchMovies({
          category: "popular",
          query: searchTerm || undefined,
          genre: selectedGenre || undefined, // Pass selected genre to API
          page: currentPage, // Pass current page to API
          pageSize: pageSize, // Pass page size to API
        })

        // Filter and sort locally after fetching the current page's movies
        const filteredAndSortedMovies = movies
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

        setStreamingMovies(filteredAndSortedMovies)
        setTotalPages(apiTotalPages)
      } catch (err) {
        console.error("Error loading movies:", err)
        setError("Failed to load movies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadStreamingMovies()

    // Listen for movie updates from dashboard
    const handleMoviesUpdate = () => {
      loadStreamingMovies()
    }

    window.addEventListener("moviesUpdated", handleMoviesUpdate)

    return () => {
      window.removeEventListener("moviesUpdated", handleMoviesUpdate)
    }
  }, [searchTerm, selectedGenre, sortBy, currentPage, pageSize]) // Re-run when these dependencies change

  // Update local state when URL search params change (e.g., from header search or direct URL)
  useEffect(() => {
    const currentQuery = searchParams.get("query")
    const currentGenre = searchParams.get("genre")
    const currentSort = searchParams.get("sort") as "title" | "year" | "rating" | null
    const currentPageParam = Number.parseInt(searchParams.get("page") || "1", 10)

    if (currentQuery !== searchTerm) {
      setSearchTerm(currentQuery || "")
    }
    if (currentGenre !== selectedGenre) {
      setSelectedGenre(currentGenre)
    }
    if (currentSort !== sortBy) {
      setSortBy(currentSort || "title")
    }
    if (currentPageParam !== currentPage) {
      setCurrentPage(currentPageParam)
    }
  }, [searchParams])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      // Optionally update URL to reflect page change
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("page", newPage.toString())
      window.history.pushState(null, "", `?${newSearchParams.toString()}`)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-6" />

          {/* Search and filters skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="h-10 bg-gray-200 animate-pulse rounded flex-1" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-16 bg-gray-200 animate-pulse rounded" />
              ))}
            </div>
          </div>

          {/* Genre filters skeleton */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </div>

        {/* Movies grid skeleton */}
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="w-28 h-40 sm:w-64 sm:h-96 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Movies</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

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

      {filteredMovies.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No movies found matching your criteria.</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setSelectedGenre(null)
              setCurrentPage(1) // Reset page on clear
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-48 mb-6" />
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="h-10 bg-gray-200 animate-pulse rounded flex-1" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 w-16 bg-gray-200 animate-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="w-28 h-40 sm:w-64 sm:h-96 bg-gray-200 animate-pulse rounded" />
            ))}
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  )
}
