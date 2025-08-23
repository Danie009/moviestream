"use client"

import React from "react"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { MovieCard } from "@/components/movie-card"
import { movieService } from "@/lib/movie-service"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Play } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import type { WatchProgress, Movie } from "@/lib/types"
import { MovieHeader } from "@/components/movie-header"

export default function HomePage() {
  const { user } = useAuth()
  const [streamingMovies, setStreamingMovies] = useState<Movie[]>([])
  const [continueWatching, setContinueWatching] = useState<Array<Movie & { progress: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load streaming movies
  useEffect(() => {
    const loadStreamingMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        const movies = await movieService.getStreamingMovies({ category: "popular" })
        setStreamingMovies(movies)
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
  }, [])

  // Load continue watching data
  useEffect(() => {
    if (user && streamingMovies.length > 0) {
      const watchProgressData = localStorage.getItem(`watchProgress-${user.id}`)
      if (watchProgressData) {
        const watchProgress: WatchProgress[] = JSON.parse(watchProgressData)

        // Get movies with progress that are still streaming
        const moviesInProgress = watchProgress
          .map((progress) => {
            const movie = streamingMovies.find((m) => m.id === progress.movieId)
            return movie ? { ...movie, progress: progress.progress } : null
          })
          .filter(Boolean) as Array<Movie & { progress: number }>

        setContinueWatching(moviesInProgress)
      }
    }
  }, [user, streamingMovies])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MovieHeader />
        <div className="min-h-screen">
          {/* Hero skeleton */}
          <div className="h-[70vh] bg-gray-200 animate-pulse" />

          <div className="container mx-auto px-4 py-8 space-y-12">
            {/* Movie rows skeleton */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-8 bg-gray-200 animate-pulse rounded w-48" />
                <div className="flex gap-4 overflow-hidden">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="w-64 h-96 bg-gray-200 animate-pulse rounded flex-shrink-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <MovieHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Movies</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  // No movies state
  if (streamingMovies.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <MovieHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No movies available</h1>
            <p className="text-muted-foreground">Check back later for new content!</p>
          </div>
        </div>
      </div>
    )
  }

  // Category filters
  const trendingMovies = streamingMovies.filter((movie) => movie.rating >= 8.5)
  const blockbusters = streamingMovies.filter(
    (movie) => movie.genre.includes("Action") || movie.genre.includes("Adventure"),
  )
  const kidsAndFamily = streamingMovies.filter((movie) => movie.genre.includes("Family"))
  const anime = streamingMovies.filter((movie) => movie.originalLanguage === "ja" && movie.genre.includes("Animation"))
  const animations = streamingMovies.filter((movie) => movie.genre.includes("Animation"))
  const comedies = streamingMovies.filter((movie) => movie.genre.includes("Comedy"))
  const kDramas = streamingMovies.filter((movie) => movie.originalLanguage === "ko")
  const tvShows = streamingMovies.filter((movie) => movie.genre.includes("TV Movie"))
  const japaneseMovies = streamingMovies.filter((movie) => movie.originalLanguage === "ja")
  const horrorThriller = streamingMovies.filter(
    (movie) => movie.genre.includes("Horror") || movie.genre.includes("Thriller"),
  )
  const romance = streamingMovies.filter((movie) => movie.genre.includes("Romance"))
  const actionAdventure = streamingMovies.filter(
    (movie) => movie.genre.includes("Action") || movie.genre.includes("Adventure"),
  )
  const classics = streamingMovies.filter((movie) => movie.releaseYear < 2000)
  const international = streamingMovies.filter((movie) => movie.originalLanguage !== "en")

  return (
    <div className="min-h-screen bg-background">
      <MovieHeader />
      <div className="min-h-screen">
        <HeroSection movies={streamingMovies} />

        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Continue Watching (if available) */}
          {continueWatching.length > 0 && (
            <MovieRow title="Continue Watching" movies={continueWatching} viewAllLink="/movies/browse" showProgress />
          )}

          {/* Trending Now */}
          {trendingMovies.length > 0 && (
            <MovieRow title="Trending Now" movies={trendingMovies} viewAllLink="/movies/browse?sort=rating" />
          )}

          {/* Blockbusters */}
          {blockbusters.length > 0 && (
            <MovieRow title="Blockbusters" movies={blockbusters} viewAllLink="/movies/browse?genre=Action" />
          )}

          {/* Kids & Family */}
          {kidsAndFamily.length > 0 && (
            <MovieRow title="Kids & Family" movies={kidsAndFamily} viewAllLink="/movies/browse?genre=Family" />
          )}

          {/* Anime */}
          {anime.length > 0 && <MovieRow title="Anime" movies={anime} viewAllLink="/movies/browse?genre=Animation" />}

          {/* Animations */}
          {animations.length > 0 && (
            <MovieRow title="Animations" movies={animations} viewAllLink="/movies/browse?genre=Animation" />
          )}

          {/* K-Dramas */}
          {kDramas.length > 0 && <MovieRow title="Korean Movies" movies={kDramas} viewAllLink="/movies/browse" />}

          {/* Japanese Movies */}
          {japaneseMovies.length > 0 && (
            <MovieRow title="Japanese Movies" movies={japaneseMovies} viewAllLink="/movies/browse" />
          )}

          {/* Comedies */}
          {comedies.length > 0 && (
            <MovieRow title="Comedies" movies={comedies} viewAllLink="/movies/browse?genre=Comedy" />
          )}

          {/* Action & Adventure */}
          {actionAdventure.length > 0 && (
            <MovieRow title="Action & Adventure" movies={actionAdventure} viewAllLink="/movies/browse?genre=Action" />
          )}

          {/* Horror & Thriller */}
          {horrorThriller.length > 0 && (
            <MovieRow title="Horror & Thriller" movies={horrorThriller} viewAllLink="/movies/browse?genre=Horror" />
          )}

          {/* Romance */}
          {romance.length > 0 && (
            <MovieRow title="Romance" movies={romance} viewAllLink="/movies/browse?genre=Romance" />
          )}

          {/* Classics */}
          {classics.length > 0 && <MovieRow title="Classic Movies" movies={classics} viewAllLink="/movies/browse" />}

          {/* International Cinema */}
          {international.length > 0 && (
            <MovieRow title="International Cinema" movies={international} viewAllLink="/movies/browse" />
          )}

          {/* All Movies - Single Scrollable Row */}
          <MovieRow title="All Movies" movies={streamingMovies} viewAllLink="/movies/browse" />
        </div>
      </div>
    </div>
  )
}

interface MovieRowProps {
  title: string
  movies: Array<Movie & { progress?: number }>
  viewAllLink: string
  showProgress?: boolean
  hideHeader?: boolean
}

function MovieRow({ title, movies, viewAllLink, showProgress = false, hideHeader = false }: MovieRowProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef
      const scrollAmount = direction === "left" ? -400 : 400
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <section>
      {!hideHeader && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-2">
              <Button variant="outline" size="icon" onClick={() => scroll("left")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => scroll("right")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" asChild>
              <Link href={viewAllLink}>View All</Link>
            </Button>
          </div>
        </div>
      )}

      {hideHeader && (
        <div className="flex justify-end items-center mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => scroll("left")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => scroll("right")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex gap-1.5 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-4 sm:px-0 -mx-4 sm:mx-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 snap-start">
            <div className="relative">
              <MovieCard movie={movie} size="small" />

              {/* Progress bar for Continue Watching */}
              {showProgress && movie.progress !== undefined && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 hidden sm:block">
                  <div className="h-1 bg-gray-700 rounded-full">
                    <div className="h-1 bg-primary rounded-full" style={{ width: `${movie.progress}%` }} />
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    <Button size="sm" variant="ghost" className="text-white" asChild>
                      <Link href={`/movies/watch/${movie.id}`}>
                        <Play className="h-4 w-4 mr-1" />
                        Resume
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
