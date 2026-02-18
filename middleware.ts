import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me')

const protectedRoutes = ['/course-1']
const authRoutes = ['/login', '/forgot-password', '/reset-password']
// NOTE: /enroll is NOT in authRoutes — logged-in unpaid users may need to reach it

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionToken = req.cookies.get('session')?.value

  let session = null
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify(sessionToken, secret)
      session = payload
    } catch {
      // Invalid token — treat as no session
    }
  }

  // Protect course routes — must be logged in AND paid
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    // Payment check happens in the page component via /api/auth/me
    // Middleware just ensures login
  }

  // Redirect logged-in users away from auth pages (but NOT /enroll)
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (session) {
      return NextResponse.redirect(new URL('/course-1', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/course-1/:path*', '/login', '/forgot-password', '/reset-password'],
}
