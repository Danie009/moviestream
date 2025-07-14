import { type NextRequest, NextResponse } from "next/server"
import { TMDB_CONFIG, type TMDBMovieDetails, getImageUrl, getBackdropUrl } from "@/lib/tmdb-api"
import type { Movie } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const tmdbId = params.id.replace("tmdb-", "")

  try {
    // Fetch movie details with videos
    const [movieResponse, videosResponse] = await Promise.all([
      fetch(`${TMDB_CONFIG.BASE_URL}/movie/${tmdbId}?api_key=${TMDB_CONFIG.API_KEY}`),
      fetch(`${TMDB_CONFIG.BASE_URL}/movie/${tmdbId}/videos?api_key=${TMDB_CONFIG.API_KEY}`),
    ])

    if (!movieResponse.ok) {
      throw new Error(`TMDB API error: ${movieResponse.status}`)
    }

    const movieData: TMDBMovieDetails = await movieResponse.json()
    const videosData = videosResponse.ok ? await videosResponse.json() : { results: [] }

    // Find trailer video
    const trailer = videosData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

    const movie: Movie = {
      id: `tmdb-${movieData.id}`,
      tmdbId: movieData.id,
      title: movieData.title,
      description: movieData.overview,
      poster: getImageUrl(movieData.poster_path),
      backdrop: getBackdropUrl(movieData.backdrop_path),
      videoUrl: trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: movieData.runtime || 120,
      releaseYear: new Date(movieData.release_date || "2000-01-01").getFullYear(),
      genre: movieData.genres.map((g) => g.name),
      language: movieData.spoken_languages[0]?.english_name || "English",
      rating: Math.round(movieData.vote_average * 10) / 10,
      featured: movieData.popularity > 100,
      isStreaming: true,
      dateAdded: new Date(),
      popularity: movieData.popularity,
      voteCount: movieData.vote_count,
      originalLanguage: movieData.original_language,
    }

    return NextResponse.json(movie)
  } catch (error) {
    console.error("Error fetching movie details:", error)
    return NextResponse.json({ error: "Failed to fetch movie details" }, { status: 500 })
  }
}
