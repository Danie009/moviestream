import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Plus, ThumbsUp, ChevronDown, Clock } from "lucide-react"
import type { Movie } from "@/lib/types"
import { RemovalWarningBanner } from "./removal-warning-banner"
import { NewMovieBanner } from "./new-movie-banner"

interface MovieCardProps {
  movie: Movie
  size?: "small" | "medium" | "large"
}

export function MovieCard({ movie, size = "medium" }: MovieCardProps) {
  const cardSizes = {
    small: "w-64 sm:w-64", // Keep desktop size, but make mobile responsive
    medium: "w-64 sm:w-64",
    large: "w-80 sm:w-80",
  }

  const imageSizes = {
    small: { width: 256, height: 384 }, // Desktop: portrait
    medium: { width: 256, height: 384 },
    large: { width: 320, height: 480 },
  }

  const cardHeights = {
    small: "h-96 sm:h-96", // Desktop height
    medium: "h-96 sm:h-96",
    large: "h-[30rem] sm:h-[30rem]",
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const getAgeRating = (rating: number) => {
    if (rating >= 8.5) return "13+"
    if (rating >= 7.0) return "PG-13"
    return "PG"
  }

  return (
    <Card
      className={`group overflow-hidden hover:scale-105 transition-all duration-300 relative cursor-pointer
  ${
    size === "small"
      ? "w-28 h-40 sm:w-64 sm:h-96" // Mobile: narrow and tall, Desktop: normal
      : size === "medium"
        ? "w-28 h-40 sm:w-64 sm:h-96"
        : "w-32 h-48 sm:w-80 sm:h-[30rem]"
  }`}
    >
      <CardContent className="p-0 h-full relative">
        {/* Movie Poster - Always Visible */}
        <div className="relative w-full h-full">
          <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />

          {/* Removal Warning Banner */}
          <RemovalWarningBanner movie={movie} />

          {/* New Movie Banner */}
          <NewMovieBanner movie={movie} />

          {/* Mobile Title Overlay - Always visible on mobile */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-1.5 sm:hidden">
            <h3 className="text-white font-medium text-[10px] leading-tight line-clamp-2">{movie.title}</h3>
          </div>

          {/* Desktop Hover Overlay - Netflix Style (hidden on mobile) */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            {/* Movie Title */}
            <div className="mb-4">
              <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1">{movie.title}</h3>
              <p className="text-white/80 text-sm line-clamp-2">{movie.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-3">
              <Button size="sm" className="rounded-full w-10 h-10 p-0 bg-white hover:bg-white/90 text-black" asChild>
                <Link href={`/movies/watch/${movie.id}`}>
                  <Play className="h-4 w-4 fill-current" />
                </Link>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-full w-10 h-10 p-0 border-2 border-white/60 bg-transparent hover:border-white text-white"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-full w-10 h-10 p-0 border-2 border-white/60 bg-transparent hover:border-white text-white"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>

              <div className="ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full w-10 h-10 p-0 border-2 border-white/60 bg-transparent hover:border-white text-white"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Movie Metadata */}
            <div className="flex items-center gap-3 mb-3 text-white text-sm">
              <Badge variant="outline" className="border-white/60 text-white bg-transparent text-xs px-2 py-1">
                {getAgeRating(movie.rating)}
              </Badge>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(movie.duration)}</span>
              </div>
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-1">
              {movie.genre.slice(0, 3).map((genre, index) => (
                <span key={genre} className="text-white/90 text-sm">
                  {genre}
                  {index < Math.min(movie.genre.length, 3) - 1 && <span className="text-white/60 mx-1">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
