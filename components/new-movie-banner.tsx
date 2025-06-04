import { Sparkles } from "lucide-react"
import type { Movie } from "@/lib/types"

interface NewMovieBannerProps {
  movie: Movie
}

export function NewMovieBanner({ movie }: NewMovieBannerProps) {
  const isNewMovie = () => {
    const now = new Date()
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const movieDate = new Date(movie.dateAdded)
    return movieDate > twoWeeksAgo
  }

  if (!isNewMovie()) return null

  return (
    <div className="absolute top-2 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md text-[8px] sm:text-xs font-bold flex items-center gap-0.5 sm:gap-1 z-10 shadow-lg">
      <Sparkles className="h-2 w-2 sm:h-3 sm:w-3" />
      <span>NEW ON MOVIESTREAM</span>
    </div>
  )
}
