import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/spaced-review',
  '/profile',
  '/settings',
  '/juz'
]

// List of auth routes
const authRoutes = ['/auth', '/auth/signin', '/auth/signup']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname === route)

  // Get the token from the session
  const token = request.cookies.get('session')

  // If trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    const url = new URL('/auth', request.url)
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // If trying to access auth routes with a token
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 