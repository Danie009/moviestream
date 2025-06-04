import type { Movie } from "./types"
import { moviesData } from "./movies-data"

class MovieService {
  private storageKey = "movies-master-data"

  // Get all movies with current streaming status and scheduled removals
  getMovies(): Movie[] {
    const savedData = localStorage.getItem(this.storageKey)
    if (savedData) {
      const movies: Movie[] = JSON.parse(savedData)
      // Clean up expired scheduled removals
      return this.cleanupExpiredRemovals(movies)
    }

    // Initialize with default data if no saved data exists
    const initializedMovies = moviesData.map((movie) => ({ ...movie }))
    this.saveMovies(initializedMovies)
    return initializedMovies
  }

  // Get only streaming movies (for /movies page)
  getStreamingMovies(): Movie[] {
    return this.getMovies().filter((movie) => movie.isStreaming)
  }

  // Get all movies (for dashboard - both streaming and non-streaming)
  getAllMovies(): Movie[] {
    return this.getMovies()
  }

  // Save movies to localStorage
  saveMovies(movies: Movie[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(movies))
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent("moviesUpdated", { detail: movies }))
  }

  // Toggle streaming status immediately
  toggleStreaming(movieId: string): Movie[] {
    const movies = this.getMovies()
    const updatedMovies = movies.map((movie) => {
      if (movie.id === movieId) {
        return {
          ...movie,
          isStreaming: !movie.isStreaming,
          // Clear scheduled removal if toggling back to streaming
          scheduledRemoval: movie.isStreaming ? movie.scheduledRemoval : undefined,
        }
      }
      return movie
    })

    this.saveMovies(updatedMovies)
    return updatedMovies
  }

  // Schedule removal in 3 days
  scheduleRemoval(movieId: string, reason?: string): Movie[] {
    const movies = this.getMovies()
    const removalDate = new Date()
    removalDate.setDate(removalDate.getDate() + 3)

    const updatedMovies = movies.map((movie) => {
      if (movie.id === movieId) {
        return {
          ...movie,
          scheduledRemoval: {
            date: removalDate,
            reason: reason || "Content license expiring",
          },
        }
      }
      return movie
    })

    this.saveMovies(updatedMovies)
    return updatedMovies
  }

  // Cancel scheduled removal
  cancelScheduledRemoval(movieId: string): Movie[] {
    const movies = this.getMovies()
    const updatedMovies = movies.map((movie) => {
      if (movie.id === movieId) {
        return {
          ...movie,
          scheduledRemoval: undefined,
        }
      }
      return movie
    })

    this.saveMovies(updatedMovies)
    return updatedMovies
  }

  // Clean up expired scheduled removals
  private cleanupExpiredRemovals(movies: Movie[]): Movie[] {
    const now = new Date()
    let hasChanges = false

    const cleanedMovies = movies.map((movie) => {
      if (movie.scheduledRemoval && new Date(movie.scheduledRemoval.date) <= now) {
        hasChanges = true
        return {
          ...movie,
          isStreaming: false,
          scheduledRemoval: undefined,
        }
      }
      return movie
    })

    if (hasChanges) {
      this.saveMovies(cleanedMovies)
    }

    return cleanedMovies
  }

  // Get days remaining for scheduled removal
  getDaysUntilRemoval(movie: Movie): number | null {
    if (!movie.scheduledRemoval) return null

    const now = new Date()
    const removalDate = new Date(movie.scheduledRemoval.date)
    const diffTime = removalDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
  }

  // Add a new movie
  addMovie(movie: Omit<Movie, "id">): Movie[] {
    const movies = this.getMovies()
    const newMovie: Movie = {
      ...movie,
      id: `movie-${Date.now()}`, // Generate a unique ID
    }

    const updatedMovies = [...movies, newMovie]
    this.saveMovies(updatedMovies)
    return updatedMovies
  }

  // Update an existing movie
  updateMovie(movieId: string, updates: Partial<Movie>): Movie[] {
    const movies = this.getMovies()
    const updatedMovies = movies.map((movie) => {
      if (movie.id === movieId) {
        return { ...movie, ...updates }
      }
      return movie
    })

    this.saveMovies(updatedMovies)
    return updatedMovies
  }

  // Delete a movie
  deleteMovie(movieId: string): Movie[] {
    const movies = this.getMovies()
    const updatedMovies = movies.filter((movie) => movie.id !== movieId)
    this.saveMovies(updatedMovies)
    return updatedMovies
  }
}

export const movieService = new MovieService()
