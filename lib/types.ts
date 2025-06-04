export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "moderator" | "user"
}

export interface Movie {
  id: string
  title: string
  description: string
  poster: string
  backdrop: string
  videoUrl: string
  duration: number
  releaseYear: number
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
}

export interface WatchProgress {
  movieId: string
  progress: number
  lastWatched: Date
}
