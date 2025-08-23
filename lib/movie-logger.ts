// Movie logging service for tracking removed movies and new movie banners
class MovieLogger {
  private removedMoviesKey = "removed-movies-log"
  private newMoviesKey = "new-movies-log"

  // Get removed movies log
  private getRemovedMovies(): Array<{ tmdbId: number; title: string; removedAt: Date; reason?: string }> {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem(this.removedMoviesKey)
    return saved ? JSON.parse(saved) : []
  }

  // Save removed movies log
  private saveRemovedMovies(movies: Array<{ tmdbId: number; title: string; removedAt: Date; reason?: string }>): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.removedMoviesKey, JSON.stringify(movies))
  }

  // Get new movies log
  private getNewMovies(): Array<{ tmdbId: number; title: string; addedAt: Date }> {
    if (typeof window === "undefined") return []
    const saved = localStorage.getItem(this.newMoviesKey)
    return saved ? JSON.parse(saved) : []
  }

  // Save new movies log
  private saveNewMovies(movies: Array<{ tmdbId: number; title: string; addedAt: Date }>): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.newMoviesKey, JSON.stringify(movies))
  }

  // Log a removed movie
  logRemovedMovie(tmdbId: number, title: string, reason?: string): void {
    const removedMovies = this.getRemovedMovies()

    // Check if movie is already in the log
    const existingIndex = removedMovies.findIndex((m) => m.tmdbId === tmdbId)

    const logEntry = {
      tmdbId,
      title,
      removedAt: new Date(),
      reason: reason || "Removed from streaming",
    }

    if (existingIndex >= 0) {
      removedMovies[existingIndex] = logEntry
    } else {
      removedMovies.push(logEntry)
    }

    this.saveRemovedMovies(removedMovies)
    console.log(`Movie logged as removed: ${title} (ID: ${tmdbId})`)
  }

  // Check if a movie is in the removed log
  isMovieRemoved(tmdbId: number): boolean {
    const removedMovies = this.getRemovedMovies()
    return removedMovies.some((m) => m.tmdbId === tmdbId)
  }

  // Log a new movie (for banner tracking)
  logNewMovie(tmdbId: number, title: string): void {
    const newMovies = this.getNewMovies()

    // Check if movie is already in the log
    const existingIndex = newMovies.findIndex((m) => m.tmdbId === tmdbId)

    if (existingIndex === -1) {
      const logEntry = {
        tmdbId,
        title,
        addedAt: new Date(),
      }

      newMovies.push(logEntry)
      this.saveNewMovies(newMovies)
      console.log(`Movie logged as new: ${title} (ID: ${tmdbId})`)
    }
  }

  // Check if a movie should show the "new" banner (less than a week old)
  shouldShowNewBanner(tmdbId: number): boolean {
    const newMovies = this.getNewMovies()
    const movie = newMovies.find((m) => m.tmdbId === tmdbId)

    if (!movie) return false

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const movieAddedDate = new Date(movie.addedAt)

    return movieAddedDate > oneWeekAgo
  }

  // Clean up old entries (movies older than a week from new movies log)
  cleanupOldEntries(): void {
    const newMovies = this.getNewMovies()
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const filteredMovies = newMovies.filter((movie) => {
      const movieAddedDate = new Date(movie.addedAt)
      return movieAddedDate > oneWeekAgo
    })

    if (filteredMovies.length !== newMovies.length) {
      this.saveNewMovies(filteredMovies)
      console.log(`Cleaned up ${newMovies.length - filteredMovies.length} old movie entries from new movies log`)
    }
  }

  // Get all removed movies (for admin viewing)
  getAllRemovedMovies(): Array<{ tmdbId: number; title: string; removedAt: Date; reason?: string }> {
    return this.getRemovedMovies()
  }

  // Get all new movies (for admin viewing)
  getAllNewMovies(): Array<{ tmdbId: number; title: string; addedAt: Date }> {
    return this.getNewMovies()
  }

  // Clear removed movies log (admin function)
  clearRemovedMoviesLog(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.removedMoviesKey)
    console.log("Removed movies log cleared")
  }

  // Clear new movies log (admin function)
  clearNewMoviesLog(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.newMoviesKey)
    console.log("New movies log cleared")
  }
}

export const movieLogger = new MovieLogger()
