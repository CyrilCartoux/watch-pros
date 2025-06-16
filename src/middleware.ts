import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from './lib/supabase/admin'

// Routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = ['/auth', '/register', '/subscription', '/pricing']

// Cache pour les routes publiques
const publicRouteCache = new Set(PUBLIC_ROUTES)

// Cache pour les profils utilisateurs (TTL: 5 minutes)
const profileCache = new Map<string, { profile: any, timestamp: number }>()
const CACHE_TTL = 1 * 60 * 1000 // 1 minutes en millisecondes

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Vérifier si la route est publique avec le cache
  if (publicRouteCache.has(path) || PUBLIC_ROUTES.some(route => path.startsWith(`${route}/`))) {
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
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({
              name,
              value,
              ...options,
            })
          },
          remove(name: string, options: CookieOptions) {
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
      // Si l'utilisateur n'est pas connecté et accède à la racine, laisser passer
      if (path === '/') {
        return NextResponse.next()
      }
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(redirectUrl)
    }

    // Rediriger vers /listings si l'utilisateur est connecté et accède à la racine
    if (path === '/') {
      return NextResponse.redirect(new URL('/listings', request.url))
    }

    // Vérifier le cache pour le profil utilisateur
    const cachedProfile = profileCache.get(user.id)
    const now = Date.now()
    let profile

    if (cachedProfile && (now - cachedProfile.timestamp) < CACHE_TTL) {
      profile = cachedProfile.profile
    } else {
      // Optimiser la requête en ne sélectionnant que les champs nécessaires
      const { data, error: profileError } = await supabaseAdmin
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
        return NextResponse.redirect(new URL('/auth', request.url))
      }

      profile = data
      // Mettre en cache le profil
      profileCache.set(user.id, { profile: data, timestamp: now })
    }

    // Si l'utilisateur est admin et essaie d'accéder à /admin, autoriser l'accès
    if (profile?.role === 'admin' && path === '/admin') {
      return res
    }

    // Vérifier le statut de l'abonnement avec une seule condition
    const hasActiveSubscription = profile?.subscriptions?.some(
      (sub: { status: string }) => sub.status === 'active'
    )

    // Rediriger en fonction du statut d'authentification
    if (!profile?.seller_id) {
      return NextResponse.redirect(new URL('/register', request.url))
    }

    const seller = profile.sellers as any
    if (!seller?.identity_verified || seller?.identity_rejected) {
      return NextResponse.redirect(new URL('/register/pending', request.url))
    }

    if (!hasActiveSubscription) {
      return NextResponse.redirect(new URL('/subscription', request.url))
    }

    // Si toutes les vérifications sont passées, continuer
    return res
  } catch (error) {
    console.error('Error in middleware:', error)
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