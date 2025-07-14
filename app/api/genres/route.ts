import { NextResponse } from "next/server"
import { TMDB_CONFIG, type TMDBGenre } from "@/lib/tmdb-api"

export async function GET() {
  try {
    const response = await fetch(`${TMDB_CONFIG.BASE_URL}/genre/movie/list?api_key=${TMDB_CONFIG.API_KEY}`)

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data: { genres: TMDBGenre[] } = await response.json()

    return NextResponse.json(data.genres)
  } catch (error) {
    console.error("Error fetching genres:", error)
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 })
  }
}
