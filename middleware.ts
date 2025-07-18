import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path
  const path = request.nextUrl.pathname

  // Get the user from the cookie
  const user = request.cookies.get("user")?.value ? JSON.parse(request.cookies.get("user")?.value || "{}") : null

  // Dashboard paths are only for admin and moderator
  if (path.startsWith("/dashboard")) {
    if (!user || (user.role !== "admin" && user.role !== "moderator")) {
      // If not authenticated or not authorized, redirect to login
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // For all other paths (including /, /auth/*, /movies/*), allow access without authentication.
  // The client-side ProtectedRoute will handle specific redirects if needed for other pages.
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
     * 6. Only apply to /dashboard paths for now
     */
    "/dashboard/:path*", // Protect all paths under /dashboard
  ],
}
