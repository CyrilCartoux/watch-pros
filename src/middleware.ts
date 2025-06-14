import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = ['/', '/auth', '/register', '/subscription', '/pricing']

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Vérifier si la route est publique
  if (PUBLIC_ROUTES.some(route => path === route || path.startsWith(`${route}/`))) {
    console.log('PUBLIC ROUTE')
    return NextResponse.next()
  }

  try {
    // Créer un client Supabase avec gestion des cookies
    const res = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value,
          set: (name, value, options) => {
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove: (name, options) => {
            res.cookies.set({
              name,
              value: '',
              ...options,
            })
          },
        },
      }
    )

    // Vérifier l'utilisateur de manière sécurisée
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }

    // Get user's profile, seller status and subscription in a single query
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        seller_id,
        role,
        sellers (
          identity_verified,
          identity_rejected
        ),
        subscriptions (
          status
        )
      `)
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Si l'utilisateur est admin et essaie d'accéder à /admin, autoriser l'accès
    if (profile?.role === 'admin' && path === '/admin') {
      return res
    }

    const hasActiveSubscription = profile?.subscriptions?.some(
      (sub: { status: string }) => sub.status === 'active')

    console.log('PROFILE', profile)
    console.log('HAS ACTIVE SUBSCRIPTION', hasActiveSubscription)
    console.log('IS VERIFIED', (profile?.sellers as any)?.identity_verified)
    console.log('IS REJECTED', (profile?.sellers as any)?.identity_rejected)
    console.log('IS SELLER', !!profile?.seller_id)
    console.log('IS ADMIN', profile?.role === 'admin')

    // Rediriger en fonction du statut d'authentification
    if (!profile?.seller_id) {
      return NextResponse.redirect(new URL('/register', request.url))
    }

    if (!(profile?.sellers as any)?.identity_verified || (profile?.sellers as any)?.identity_rejected) {
      return NextResponse.redirect(new URL('/register/pending', request.url))
    }

    if (!hasActiveSubscription) {
      return NextResponse.redirect(new URL('/subscription', request.url))
    }

    // Si toutes les vérifications sont passées, continuer
    return res
  } catch (error) {
    console.error('Error in middleware:', error)
    // En cas d'erreur, rediriger vers la page de connexion
    return NextResponse.redirect(new URL('/auth', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
}