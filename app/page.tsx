import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Users, Shield } from "lucide-react"
import { Logo } from "@/components/logo"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Logo size="lg" className="text-white" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="text-white hover:text-primary">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Stream Movies
            <span className="block text-primary">Anywhere</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover thousands of movies, watch instantly, and enjoy unlimited entertainment. Your favorite films are
            just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link href="/auth/signup">
                <Play className="mr-2 h-5 w-5" />
                Start Watching Free
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 border-white text-gray-900 hover:bg-white hover:text-gray-900"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-white">Instant Streaming</CardTitle>
              <CardDescription className="text-gray-400">
                Watch movies instantly with high-quality streaming. No downloads required.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Image src="/logo.png" alt="MovieStream" width={24} height={24} className="rounded-md" />
              </div>
              <CardTitle className="text-white">Huge Library</CardTitle>
              <CardDescription className="text-gray-400">
                Access thousands of movies across all genres. From classics to latest releases.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-white">Personal Experience</CardTitle>
              <CardDescription className="text-gray-400">
                Create your watchlist, track progress, and get personalized recommendations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gray-800/50 border-gray-700 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white mb-4">Ready to Start Watching?</CardTitle>
              <CardDescription className="text-gray-400 mb-6">
                Join thousands of movie lovers and start your streaming journey today.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/auth/signup">Create Free Account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Link href="/auth/login">Already have an account?</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Admin Notice 
        <div className="mt-16 text-center">
          <Card className="bg-blue-900/20 border-blue-700 max-w-md mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center mb-2">
                <Shield className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-blue-400 font-medium">Admin Access</span>
              </div>
              <p className="text-sm text-blue-300 mb-4">Platform administrators can access the management dashboard</p>
              <Button size="sm" variant="outline" asChild className="border-blue-600 text-blue-300 hover:bg-blue-800">
                <Link href="/auth/login">Admin Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div> */}
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="text-center text-gray-400">
          <p>&copy; 2025 MovieStream. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
