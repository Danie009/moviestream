import { type NextRequest, NextResponse } from "next/server"
import {
  TMDB_CONFIG,
  type TMDBResponse,
  type TMDBMovie,
  GENRE_MAP,
  getImageUrl,
  getBackdropUrl,
  createHeaders,
} from "@/lib/tmdb-api"
import type { Movie } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") || "1"
  const category = searchParams.get("category") || "popular"
  const genre = searchParams.get("genre")
  const query = searchParams.get("query")

  try {
    let url = `${TMDB_CONFIG.BASE_URL}/movie/${category}?page=${page}`

    if (query) {
      url = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`
    } else if (genre) {
      url = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genre}&page=${page}`
    }

    const response = await fetch(url, {
      headers: createHeaders(),
    })

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data: TMDBResponse<TMDBMovie> = await response.json()

    // Transform TMDB data to our Movie format
    const movies: Movie[] = data.results.map((tmdbMovie) => ({
      id: `tmdb-${tmdbMovie.id}`,
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      description: tmdbMovie.overview,
      poster: getImageUrl(tmdbMovie.poster_path),
      backdrop: getBackdropUrl(tmdbMovie.backdrop_path),
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Default video
      duration: 120, // Default duration, will be updated when we fetch details
      releaseYear: new Date(tmdbMovie.release_date || "2000-01-01").getFullYear(),
      genre: tmdbMovie.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean),
      language:
        tmdbMovie.original_language === "en"
          ? "English"
          : tmdbMovie.original_language === "ja"
            ? "Japanese"
            : tmdbMovie.original_language === "ko"
              ? "Korean"
              : tmdbMovie.original_language === "es"
                ? "Spanish"
                : tmdbMovie.original_language === "fr"
                  ? "French"
                  : "Other",
      rating: Math.round(tmdbMovie.vote_average * 10) / 10,
      featured: tmdbMovie.popularity > 100,
      isStreaming: true, // Default to streaming, can be managed separately
      dateAdded: new Date(),
      popularity: tmdbMovie.popularity,
      voteCount: tmdbMovie.vote_count,
      originalLanguage: tmdbMovie.original_language,
    }))

    return NextResponse.json({
      movies,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    })
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}
