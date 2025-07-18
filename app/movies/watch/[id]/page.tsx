"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { movieService } from "@/lib/movie-service"
import { MovieCard } from "@/components/movie-card"
import { useAuth } from "@/components/auth-provider"
import type { WatchProgress, Movie } from "@/lib/types"

export default function WatchMoviePage() {
  const params = useParams()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const { user } = useAuth()

  const [movie, setMovie] = useState<Movie | null>(null)
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [initialTimeSet, setInitialTimeSet] = useState(false)

  // Load movie and related movies
  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true)
        const movieData = await movieService.fetchMovieDetails(params.id as string)
        if (movieData) {
          setMovie(movieData)

          // Get related movies based on genre
          const allMovies = await movieService.getStreamingMovies({ category: "popular" })
          const related = allMovies
            .filter((m) => m.id !== movieData.id && m.genre.some((genre) => movieData.genre.includes(genre)))
            .slice(0, 4)
          setRelatedMovies(related)
        }
      } catch (error) {
        console.error("Error loading movie:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadMovie()
    }
  }, [params.id])

  // Load saved progress
  useEffect(() => {
    if (movie && user && videoRef.current && !initialTimeSet) {
      const watchProgressData = localStorage.getItem(`watchProgress-${user.id}`)
      if (watchProgressData) {
        const watchProgress: WatchProgress[] = JSON.parse(watchProgressData)
        const movieProgress = watchProgress.find((p) => p.movieId === movie.id)

        if (movieProgress && videoRef.current) {
          const timeToSet = (movieProgress.progress / 100) * videoRef.current.duration
          if (!isNaN(timeToSet) && isFinite(timeToSet)) {
            videoRef.current.currentTime = timeToSet
            setInitialTimeSet(true)
          }
        }
      }
    }
  }, [movie, user, duration, initialTimeSet])

  // Save progress periodically
  useEffect(() => {
    if (!movie || !user || !duration) return

    const saveInterval = setInterval(() => {
      if (videoRef.current && currentTime > 0) {
        const progressPercent = Math.floor((currentTime / duration) * 100)

        const watchProgressData = localStorage.getItem(`watchProgress-${user.id}`)
        const watchProgress: WatchProgress[] = watchProgressData ? JSON.parse(watchProgressData) : []

        const existingIndex = watchProgress.findIndex((p) => p.movieId === movie.id)
        const newProgress = {
          movieId: movie.id,
          progress: progressPercent,
          lastWatched: new Date(),
        }

        if (existingIndex >= 0) {
          watchProgress[existingIndex] = newProgress
        } else {
          watchProgress.push(newProgress)
        }

        localStorage.setItem(`watchProgress-${user.id}`, JSON.stringify(watchProgress))
      }
    }, 5000)

    return () => clearInterval(saveInterval)
  }, [movie, user, currentTime, duration])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timeout)
  }, [showControls])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading movie...</p>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const handleDownload = () => {
    // In a real app, this would trigger a download
    alert("Download feature would be implemented here")
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }
  // Example: Block common ad domains before loading the iframe
  const adDomains = [
    'doubleclick.net',
    'googleads.com',
    'googlesyndication.com',
    'adservice.google.com'
  ];

  const originalCreateElement = document.createElement;
    document.createElement = function (tag) {
    if (tag.toLowerCase() === 'iframe') {
      const iframe = originalCreateElement.call(document, tag);
      const originalSrc = iframe.getAttribute('src');
      
      // Modify the iframe src to strip tracking/ads
      if (originalSrc && adDomains.some(domain => originalSrc.includes(domain))) {
        iframe.removeAttribute('src');
        console.log('Blocked ad domain in iframe');
      }
      return iframe;
    }
    return originalCreateElement.call(document, tag);
  };


  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div
        className="relative w-full h-screen"
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* <video
          ref={videoRef}
          src={movie.videoUrl}
          className="w-full h-full object-cover"
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        /> */}

        <iframe
          src={`https://player.embed-api.stream/?id=${movie.tmdbId}&type=movie`}
          frameBorder="0"
          allowFullScreen
          className="w-full h-full rounded-md"
        />

        {/* Video Controls Overlay */}
        {/*
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-white text-xl font-semibold">{movie.title}</h1>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={togglePlay}
              className="w-20 h-20 rounded-full bg-black/50 hover:bg-black/70"
            >
              {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white ml-1" />}
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div
              className="w-full bg-white/20 rounded-full h-1 mb-4 cursor-pointer"
              onClick={(e) => {
                if (videoRef.current) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pos = (e.clientX - rect.left) / rect.width
                  videoRef.current.currentTime = pos * duration
                }
              }}
            >
              <div
                className="bg-red-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm">
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        */}
      </div>

      {/* Movie Details & Related */}
      <div className="container mx-auto px-4 py-8">
        {/* Movie Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">{movie.title}</h2>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{movie.rating}</span>
              </div>
              <span>{movie.releaseYear}</span>
              <span>
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
          </CardContent>
        </Card>

        {/* More Like This */}
        {relatedMovies.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-6">More Like This</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {relatedMovies.map((relatedMovie) => (
                <div key={relatedMovie.id} className="flex-shrink-0">
                  <MovieCard movie={relatedMovie} size="small" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
