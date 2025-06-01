import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './lib/supabase/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not /auth/*, redirect to /auth
  // if (!session && !request.nextUrl.pathname.startsWith('/auth')) {
  //   return NextResponse.redirect(new URL('/auth', request.url))
  // }

  // If user is signed in and the current path is /auth, redirect to /
  // if (session && request.nextUrl.pathname.startsWith('/auth')) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 