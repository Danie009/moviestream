import { AlertTriangle } from "lucide-react"
import type { Movie } from "@/lib/types"
import { movieService } from "@/lib/movie-service"

interface RemovalWarningBannerProps {
  movie: Movie
}

export function RemovalWarningBanner({ movie }: RemovalWarningBannerProps) {
  if (!movie.scheduledRemoval) return null

  const daysRemaining = movieService.getDaysUntilRemoval(movie)

  if (daysRemaining === null || daysRemaining < 0) return null

  const getUrgencyColor = (days: number) => {
    if (days <= 1) return "bg-red-600"
    if (days <= 2) return "bg-orange-600"
    return "bg-yellow-600"
  }

  const getUrgencyText = (days: number) => {
    if (days === 0) return "Leaving today"
    if (days === 1) return "Leaving tomorrow"
    return `Leaving in ${days} days`
  }

  return (
    <div
      className={`absolute top-2 left-2 right-2 ${getUrgencyColor(daysRemaining)} text-white p-1 sm:p-2 rounded-md text-[8px] sm:text-xs font-medium flex items-center gap-0.5 sm:gap-1 z-10`}
    >
      <AlertTriangle className="h-2 w-2 sm:h-3 sm:w-3" />
      <span>{getUrgencyText(daysRemaining)}</span>
    </div>
  )
}
