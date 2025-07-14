// TMDB API configuration and types
export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
}

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  genre_ids: number[]
  original_language: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  video: boolean
  runtime?: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number
  genres: TMDBGenre[]
  production_countries: Array<{
    iso_3166_1: string
    name: string
  }>
  spoken_languages: Array<{
    english_name: string
    iso_639_1: string
    name: string
  }>
  videos?: {
    results: Array<{
      id: string
      key: string
      name: string
      site: string
      type: string
      official: boolean
    }>
  }
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// Helper functions
export const getImageUrl = (path: string | null, size = "w500"): string => {
  if (!path) return "/placeholder.svg?height=600&width=400"
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path: string | null, size = "w1280"): string => {
  if (!path) return "/placeholder.svg?height=720&width=1280"
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`
}

// Genre mapping
export const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
}
