"use client"
import { AuthRedirect } from "@/components/auth-redirect" // Keep AuthRedirect for admin login
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect directly to movies page
    router.replace("/movies")
  }, [router])

  return (
    <AuthRedirect>
      {" "}
      {/* Keep AuthRedirect to handle admin login redirection */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Redirecting to MovieStream...</p>
        </div>
      </div>
    </AuthRedirect>
  )
}
