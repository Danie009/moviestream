import type { Movie, StreamingStatus } from "./types"

class MovieService {
  private streamingStatusKey = "streaming-status"
  private baseUrl = "/api/movies"

  // Get streaming status from localStorage
  private getStreamingStatuses(): StreamingStatus[] {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem(this.streamingStatusKey)
    return saved ? JSON.parse(saved) : []
  }

  // Save streaming status to localStorage
  private saveStreamingStatuses(statuses: StreamingStatus[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.streamingStatusKey, JSON.stringify(statuses))
    window.dispatchEvent(new CustomEvent("moviesUpdated", { detail: statuses }))
  }

  // Fetch movies from TMDB API
  async fetchMovies(
    options: {
      category?: string
      genre?: string
      query?: string
    } = {},
  ): Promise<Movie[]> {
    const { category = "popular", genre, query } = options

    const params = new URLSearchParams({
      category,
    })

    if (genre) params.append("genre", genre)
    if (query) params.append("query", query)

    const response = await fetch(`${this.baseUrl}?${params}`)

    if (!response.ok) {
      throw new Error("Failed to fetch movies")
    }

    const data = await response.json()

    // Merge with streaming status
    const streamingStatuses = this.getStreamingStatuses()
    const moviesWithStatus = data.movies.map((movie: Movie) => {
      const status = streamingStatuses.find((s) => s.tmdbId === movie.tmdbId)
      return {
        ...movie,
        isStreaming: status?.isStreaming ?? true,
        featured: status?.featured ?? movie.featured,
        dateAdded: status?.dateAdded ? new Date(status.dateAdded) : movie.dateAdded,
        scheduledRemoval: status?.scheduledRemoval,
        videoUrl: status?.videoUrl || movie.videoUrl,
      }
    })

    return moviesWithStatus
  }

  // Fetch single movie details
  async fetchMovieDetails(id: string): Promise<Movie | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch movie details")
      }

      const movie = await response.json()

      // Merge with streaming status
      const streamingStatuses = this.getStreamingStatuses()
      const status = streamingStatuses.find((s) => s.tmdbId === movie.tmdbId)

      return {
        ...movie,
        isStreaming: status?.isStreaming ?? true,
        featured: status?.featured ?? movie.featured,
        dateAdded: status?.dateAdded ? new Date(status.dateAdded) : movie.dateAdded,
        scheduledRemoval: status?.scheduledRemoval,
        videoUrl: status?.videoUrl || movie.videoUrl,
      }
    } catch (error) {
      console.error("Error fetching movie details:", error)
      return null
    }
  }

  // Get only streaming movies
  async getStreamingMovies(
    options: {
      category?: string
      genre?: string
      query?: string
    } = {},
  ): Promise<Movie[]> {
    const movies = await this.fetchMovies(options)
    return movies.filter((movie) => movie.isStreaming)
  }

  // Get all movies (for dashboard)
  async getAllMovies(
    options: {
      category?: string
      genre?: string
      query?: string
    } = {},
  ): Promise<Movie[]> {
    return await this.fetchMovies(options)
  }

  // Toggle streaming status
  toggleStreaming(tmdbId: number): void {
    const statuses = this.getStreamingStatuses()
    const existingIndex = statuses.findIndex((s) => s.tmdbId === tmdbId)

    if (existingIndex >= 0) {
      statuses[existingIndex].isStreaming = !statuses[existingIndex].isStreaming
      if (statuses[existingIndex].isStreaming) {
        delete statuses[existingIndex].scheduledRemoval
      }
    } else {
      statuses.push({
        tmdbId,
        isStreaming: false,
        featured: false,
        dateAdded: new Date(),
      })
    }

    this.saveStreamingStatuses(statuses)
  }

  // Schedule removal
  scheduleRemoval(tmdbId: number, reason?: string): void {
    const statuses = this.getStreamingStatuses()
    const existingIndex = statuses.findIndex((s) => s.tmdbId === tmdbId)
    const removalDate = new Date()
    removalDate.setDate(removalDate.getDate() + 3)

    if (existingIndex >= 0) {
      statuses[existingIndex].scheduledRemoval = {
        date: removalDate,
        reason: reason || "Content license expiring",
      }
    } else {
      statuses.push({
        tmdbId,
        isStreaming: true,
        featured: false,
        dateAdded: new Date(),
        scheduledRemoval: {
          date: removalDate,
          reason: reason || "Content license expiring",
        },
      })
    }

    this.saveStreamingStatuses(statuses)
  }

  // Cancel scheduled removal
  cancelScheduledRemoval(tmdbId: number): void {
    const statuses = this.getStreamingStatuses()
    const existingIndex = statuses.findIndex((s) => s.tmdbId === tmdbId)

    if (existingIndex >= 0) {
      delete statuses[existingIndex].scheduledRemoval
      this.saveStreamingStatuses(statuses)
    }
  }

  // Get days until removal
  getDaysUntilRemoval(movie: Movie): number | null {
    if (!movie.scheduledRemoval) return null

    const now = new Date()
    const removalDate = new Date(movie.scheduledRemoval.date)
    const diffTime = removalDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  // Set custom video URL for a movie
  setVideoUrl(tmdbId: number, videoUrl: string): void {
    const statuses = this.getStreamingStatuses()
    const existingIndex = statuses.findIndex((s) => s.tmdbId === tmdbId)

    if (existingIndex >= 0) {
      statuses[existingIndex].videoUrl = videoUrl
    } else {
      statuses.push({
        tmdbId,
        isStreaming: true,
        featured: false,
        dateAdded: new Date(),
        videoUrl,
      })
    }

    this.saveStreamingStatuses(statuses)
  }
}

export const movieService = new MovieService()
