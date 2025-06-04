import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path
  const path = request.nextUrl.pathname

  // Get the user from the cookie
  const user = request.cookies.get("user")?.value ? JSON.parse(request.cookies.get("user")?.value || "{}") : null

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path.startsWith("/auth/")

  // If user is authenticated and trying to access public paths, let them
  // This prevents redirects from the landing page
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If user is not authenticated and trying to access protected paths, redirect to login
  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // If user is authenticated, check role-based access
  if (user) {
    // Dashboard paths are only for admin and moderator
    if (path.startsWith("/dashboard") && user.role !== "admin" && user.role !== "moderator") {
      return NextResponse.redirect(new URL("/movies", request.url))
    }
  }

  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
  ],
}
