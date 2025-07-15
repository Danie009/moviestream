import { type NextRequest, NextResponse } from "next/server"
import {
  TMDB_CONFIG,
  type TMDBResponse,
  type TMDBMovie,
  GENRE_MAP,
  getImageUrl,
  getBackdropUrl,
  createHeaders,
  shouldFilterMovie,
} from "@/lib/tmdb-api"
import type { Movie } from "@/lib/types"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category") || "popular"
  const genre = searchParams.get("genre")
  const query = searchParams.get("query")
  const page = Number.parseInt(searchParams.get("page") || "1", 10) // Get page number
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "20", 10) // Get page size (limit)

  try {
    let url: string
    const tmdbPage = page // Use the requested page for TMDB

    if (query) {
      url = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${tmdbPage}&include_adult=false`
    } else if (genre) {
      url = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genre}&page=${tmdbPage}&include_adult=false`
    } else {
      url = `${TMDB_CONFIG.BASE_URL}/movie/${category}?page=${tmdbPage}&include_adult=false`
    }

    const response = await fetch(url, {
      headers: createHeaders(),
    })

    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} - ${response.statusText}`)
      throw new Error(`Failed to fetch movies from TMDB: ${response.statusText}`)
    }

    const data: TMDBResponse<TMDBMovie> = await response.json()

    // Filter out adult content and Philippines movies
    const filteredResults = data.results.filter((movie) => !shouldFilterMovie(movie))

    // Additional filtering for quality content
    const qualityMovies = filteredResults.filter((movie) => {
      // Filter out movies with very low ratings or vote counts
      return movie.vote_average > 3.0 && movie.vote_count > 10
    })

    // Transform TMDB data to our Movie format
    const movies: Movie[] = qualityMovies.map((tmdbMovie) => ({
      id: `tmdb-${tmdbMovie.id}`,
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      description: tmdbMovie.overview,
      poster: getImageUrl(tmdbMovie.poster_path),
      backdrop: getBackdropUrl(tmdbMovie.backdrop_path),
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 120, // Default duration
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
                  : tmdbMovie.original_language === "de"
                    ? "German"
                    : tmdbMovie.original_language === "it"
                      ? "Italian"
                      : tmdbMovie.original_language === "pt"
                        ? "Portuguese"
                        : tmdbMovie.original_language === "ru"
                          ? "Russian"
                          : tmdbMovie.original_language === "hi"
                            ? "Hindi"
                            : tmdbMovie.original_language === "zh"
                              ? "Chinese"
                              : "Other",
      rating: Math.round(tmdbMovie.vote_average * 10) / 10,
      featured: tmdbMovie.popularity > 100,
      isStreaming: true,
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
