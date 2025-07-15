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

  try {
    let allMovies: TMDBMovie[] = []
    const maxPages = query ? 5 : 20 // Limit search results but get more for browsing

    // Fetch multiple pages to get more movies
    for (let page = 1; page <= maxPages; page++) {
      let url = `${TMDB_CONFIG.BASE_URL}/movie/${category}?page=${page}&include_adult=false`

      if (query) {
        url = `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
      } else if (genre) {
        url = `${TMDB_CONFIG.BASE_URL}/discover/movie?with_genres=${genre}&page=${page}&include_adult=false`
      }

      const response = await fetch(url, {
        headers: createHeaders(),
      })

      if (!response.ok) {
        console.warn(`TMDB API error for page ${page}: ${response.status}`)
        break // Stop if we hit an error
      }

      const data: TMDBResponse<TMDBMovie> = await response.json()

      // Filter out adult content and Philippines movies
      const filteredResults = data.results.filter((movie) => !shouldFilterMovie(movie))

      allMovies = [...allMovies, ...filteredResults]

      // Stop if we've reached the last page
      if (page >= data.total_pages) {
        break
      }
    }

    // Remove duplicates based on TMDB ID
    const uniqueMovies = allMovies.filter((movie, index, self) => index === self.findIndex((m) => m.id === movie.id))

    // Additional filtering for quality content
    const qualityMovies = uniqueMovies.filter((movie) => {
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
      totalResults: movies.length,
    })
  } catch (error) {
    console.error("Error fetching movies:", error)
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 })
  }
}
