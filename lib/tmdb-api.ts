// TMDB API configuration and types
export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  // Removed API_KEY from here as it's not needed on the client and was causing exposure
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
  production_countries?: Array<{
    iso_3166_1: string
    name: string
  }>
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

// Create fetch headers with authentication
export const createHeaders = () => {
  // Directly use the server-side environment variable
  const accessToken = process.env.TMDB_ACCESS_TOKEN
  if (!accessToken) {
    // In a production environment, ensure this variable is set.
    // For development, you might have a fallback or throw a more specific error.
    console.error("TMDB_ACCESS_TOKEN is not defined. Ensure it's set in your environment variables.")
    throw new Error("Authentication token missing for TMDB API.")
  }
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  }
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

// Content filtering functions
export const isAdultContent = (movie: TMDBMovie): boolean => {
  // Check if movie is marked as adult
  if (movie.adult) return true

  // Check for adult/erotic keywords in title and overview
  const adultKeywords = [
    "sex",
    "erotic",
    "porn",
    "xxx",
    "adult",
    "nude",
    "naked",
    "strip",
    "seduction",
    "lust",
    "desire",
    "passion",
    "intimate",
    "sensual",
    "sexual",
    "bedroom",
    "escort",
    "prostitute",
    "brothel",
    "red light",
    "playboy",
    "playgirl",
    "fifty shades",
    "nymphomaniac",
    "blue is the warmest",
    "love actually",
    "showgirls",
    "basic instinct",
    "fatal attraction",
  ]

  const title = movie.title.toLowerCase()
  const overview = (movie.overview || "").toLowerCase()

  return adultKeywords.some((keyword) => title.includes(keyword) || overview.includes(keyword))
}

export const isFromPhilippines = (movie: TMDBMovie): boolean => {
  // Check if movie is from Philippines
  if (movie.production_countries) {
    return movie.production_countries.some(
      (country) => country.iso_3166_1 === "PH" || country.name.toLowerCase().includes("philippines"),
    )
  }

  // Check for Filipino language codes
  const filipinoLanguages = ["tl", "fil", "ceb", "ilo", "hil", "war", "pam", "pag", "bcl", "mag"]
  if (filipinoLanguages.includes(movie.original_language)) {
    return true
  }

  // Check for Filipino keywords in title
  const filipinoKeywords = ["tagalog", "filipino", "pinoy", "manila", "cebu", "davao"]
  const title = movie.title.toLowerCase()
  const overview = (movie.overview || "").toLowerCase()

  return filipinoKeywords.some((keyword) => title.includes(keyword) || overview.includes(keyword))
}

export const shouldFilterMovie = (movie: TMDBMovie): boolean => {
  return isAdultContent(movie) || isFromPhilippines(movie)
}
