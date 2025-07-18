export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "moderator" | "user"
}

// Updated Movie interface to work with TMDB data
export interface Movie {
  id: string
  tmdbId: number
  title: string
  description: string
  poster: string
  backdrop: string
  videoUrl: string
  duration: number
  releaseYear: number
  releaseDate: string // Added to store the full release date string
  genre: string[]
  language: string
  rating: number
  featured: boolean
  isStreaming: boolean
  dateAdded: Date
  scheduledRemoval?: {
    date: Date
    reason?: string
  }
  // Additional TMDB fields
  popularity: number
  voteCount: number
  originalLanguage: string
}

export interface WatchProgress {
  movieId: string
  progress: number
  lastWatched: Date
}

// Streaming status for movies (since TMDB doesn't have this)
export interface StreamingStatus {
  tmdbId: number
  isStreaming: boolean
  featured: boolean
  dateAdded: Date
  scheduledRemoval?: {
    date: Date
    reason?: string
  }
  videoUrl?: string
}
