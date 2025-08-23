"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Play,
  Square,
  Star,
  Clock,
  Globe,
  AlertTriangle,
  Calendar,
  X,
  User,
  Eye,
  Copy,
  Trash2,
  RotateCcw,
} from "lucide-react"
import { movieService } from "@/lib/movie-service"
import { movieLogger } from "@/lib/movie-logger"
import type { Movie } from "@/lib/types"
import Image from "next/image"

export default function MoviesManagementPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<
    "all" | "streaming" | "not-streaming" | "scheduled-removal" | "removed"
  >("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load ALL movies on component mount (both streaming and non-streaming)
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true)
        setError(null)
        const loadedMovies = await movieService.getAllMovies({ category: "popular" })
        setMovies(loadedMovies)
      } catch (err) {
        console.error("Error loading movies:", err)
        setError("Failed to load movies. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadMovies()

    // Listen for movie updates
    const handleMoviesUpdate = () => {
      loadMovies()
    }

    window.addEventListener("moviesUpdated", handleMoviesUpdate as EventListener)

    return () => {
      window.removeEventListener("moviesUpdated", handleMoviesUpdate as EventListener)
    }
  }, [])

  // Filter movies based on search and status
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
      movie.language.toLowerCase().includes(searchTerm.toLowerCase())

    const isRemoved = movieLogger.isMovieRemoved(movie.tmdbId)

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "streaming" && movie.isStreaming && !movie.scheduledRemoval && !isRemoved) ||
      (filterStatus === "not-streaming" && !movie.isStreaming && !isRemoved) ||
      (filterStatus === "scheduled-removal" && movie.scheduledRemoval && !isRemoved) ||
      (filterStatus === "removed" && isRemoved)

    return matchesSearch && matchesStatus
  })

  const toggleStreaming = (tmdbId: number) => {
    movieService.toggleStreaming(tmdbId)
  }

  const restoreMovie = (tmdbId: number) => {
    movieService.restoreMovie(tmdbId)
  }

  const scheduleRemoval = (tmdbId: number) => {
    movieService.scheduleRemoval(tmdbId)
  }

  const cancelScheduledRemoval = (tmdbId: number) => {
    movieService.cancelScheduledRemoval(tmdbId)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const streamingCount = movies.filter(
    (m) => m.isStreaming && !m.scheduledRemoval && !movieLogger.isMovieRemoved(m.tmdbId),
  ).length
  const scheduledRemovalCount = movies.filter((m) => m.scheduledRemoval && !movieLogger.isMovieRemoved(m.tmdbId)).length
  const totalCount = movies.length
  const notStreamingCount = movies.filter((m) => !m.isStreaming && !movieLogger.isMovieRemoved(m.tmdbId)).length
  const removedCount = movies.filter((m) => movieLogger.isMovieRemoved(m.tmdbId)).length

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-gray-200 animate-pulse rounded w-64 mb-2" />
            <div className="h-4 bg-gray-200 animate-pulse rounded w-96" />
          </div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="h-96 bg-gray-200 animate-pulse rounded" />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 w-full">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Error Loading Movies</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Movies Management</h2>
          <p className="text-muted-foreground">Master control for all movies and their streaming availability</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Movie
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">Complete library</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Streaming</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streamingCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalCount > 0 ? Math.round((streamingCount / totalCount) * 100) : 0}% of library
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Streaming</CardTitle>
            <Square className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notStreamingCount}</div>
            <p className="text-xs text-muted-foreground">Available to add</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Removal</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledRemovalCount}</div>
            <p className="text-xs text-muted-foreground">Leaving in 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Removed Movies</CardTitle>
            <Trash2 className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{removedCount}</div>
            <p className="text-xs text-muted-foreground">In removal log</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Movie Library</CardTitle>
          <CardDescription>Master control for all movies and their streaming status</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies, genres, or languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All Movies ({totalCount})
              </Button>
              <Button
                variant={filterStatus === "streaming" ? "default" : "outline"}
                onClick={() => setFilterStatus("streaming")}
                size="sm"
              >
                Streaming ({streamingCount})
              </Button>
              <Button
                variant={filterStatus === "not-streaming" ? "default" : "outline"}
                onClick={() => setFilterStatus("not-streaming")}
                size="sm"
              >
                Not Streaming ({notStreamingCount})
              </Button>
              <Button
                variant={filterStatus === "scheduled-removal" ? "default" : "outline"}
                onClick={() => setFilterStatus("scheduled-removal")}
                size="sm"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Scheduled Removal ({scheduledRemovalCount})
              </Button>
              <Button
                variant={filterStatus === "removed" ? "default" : "outline"}
                onClick={() => setFilterStatus("removed")}
                size="sm"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Removed ({removedCount})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Poster</TableHead>
                  <TableHead className="min-w-[200px]">Title</TableHead>
                  <TableHead className="min-w-[200px]">Genre</TableHead>
                  <TableHead className="min-w-[100px]">Language</TableHead>
                  <TableHead className="w-[80px]">Year</TableHead>
                  <TableHead className="w-[150px]">Duration</TableHead>
                  <TableHead className="w-[80px]">Rating</TableHead>
                  <TableHead className="min-w-[170px]">Status</TableHead>
                  <TableHead className="min-w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovies.map((movie) => {
                  const daysUntilRemoval = movieService.getDaysUntilRemoval(movie)
                  const isRemoved = movieLogger.isMovieRemoved(movie.tmdbId)

                  return (
                    <TableRow key={movie.id}>
                      <TableCell>
                        <div className="relative">
                          <Image
                            src={movie.poster || "/placeholder.svg"}
                            alt={movie.title}
                            width={60}
                            height={90}
                            className="rounded-md object-cover"
                          />
                          {movie.scheduledRemoval && !isRemoved && (
                            <div className="absolute -top-1 -right-1">
                              <Badge variant="destructive" className="text-xs px-1">
                                <AlertTriangle className="h-2 w-2 mr-1" />
                                {daysUntilRemoval}d
                              </Badge>
                            </div>
                          )}
                          {isRemoved && (
                            <div className="absolute -top-1 -right-1">
                              <Badge variant="destructive" className="text-xs px-1">
                                <Trash2 className="h-2 w-2 mr-1" />
                                REMOVED
                              </Badge>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="font-medium truncate">{movie.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">{movie.description}</div>
                          {movie.scheduledRemoval && !isRemoved && (
                            <div className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Scheduled removal: {new Date(movie.scheduledRemoval.date).toLocaleDateString()}
                            </div>
                          )}
                          {isRemoved && (
                            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                              <Trash2 className="h-3 w-3" />
                              Removed from streaming
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {movie.genre.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                          {movie.genre.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{movie.genre.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{movie.language}</span>
                        </div>
                      </TableCell>
                      <TableCell>{movie.releaseYear}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{formatDuration(movie.duration)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{movie.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {isRemoved ? (
                            <Badge variant="destructive">
                              <Trash2 className="h-2 w-2 mr-1" />
                              Removed
                            </Badge>
                          ) : (
                            <Badge
                              variant={movie.isStreaming ? "default" : "secondary"}
                              className={movie.isStreaming ? "bg-green-600" : ""}
                            >
                              {movie.isStreaming ? "Streaming" : "Not Streaming"}
                            </Badge>
                          )}
                          {movie.scheduledRemoval && !isRemoved && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              <AlertTriangle className="h-2 w-2 mr-1" />
                              Removing in {daysUntilRemoval}d
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {isRemoved ? (
                              <DropdownMenuItem onClick={() => restoreMovie(movie.tmdbId)}>
                                <RotateCcw className="h-3 w-3 mr-2" />
                                Restore Movie
                              </DropdownMenuItem>
                            ) : movie.scheduledRemoval ? (
                              <DropdownMenuItem onClick={() => cancelScheduledRemoval(movie.tmdbId)}>
                                <X className="h-3 w-3 mr-2" />
                                Cancel Scheduled Removal
                              </DropdownMenuItem>
                            ) : (
                              <>
                                <DropdownMenuItem onClick={() => toggleStreaming(movie.tmdbId)}>
                                  {movie.isStreaming ? (
                                    <>
                                      <Square className="h-3 w-3 mr-2" />
                                      Remove from Streaming
                                    </>
                                  ) : (
                                    <>
                                      <Play className="h-3 w-3 mr-2" />
                                      Add to Streaming
                                    </>
                                  )}
                                </DropdownMenuItem>
                                {movie.isStreaming && (
                                  <DropdownMenuItem onClick={() => scheduleRemoval(movie.tmdbId)}>
                                    <Calendar className="h-3 w-3 mr-2" />
                                    Schedule Removal (3 days)
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                            <DropdownMenuItem>
                              <User className="h-3 w-3 mr-2" />
                              Edit Movie
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-3 w-3 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-3 w-3 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-3 w-3 mr-2" />
                              Delete Movie
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No movies found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                }}
                className="mt-4"
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
