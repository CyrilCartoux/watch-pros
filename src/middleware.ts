import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './lib/supabase/server'

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = [
  '/',
  '/auth',
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/auth/verify-email',
  '/auth/auth-error',
  '/auth/auth-code-error',
]

export async function middleware(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Vérifier si la route actuelle est publique
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route.replace('[id]', ''))
  )

  // Si la route est publique, permettre l'accès
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Récupérer le profil de l'utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('seller_id')
    .eq('id', session.user.id)
    .single()

  // Si l'utilisateur n'a pas d'identité de vendeur, rediriger vers la page d'inscription vendeur
  if (!profile?.seller_id) {
    return NextResponse.redirect(new URL('/seller/register', request.url))
  }

  // Vérifier si l'identité du vendeur est validée
  const { data: seller } = await supabase
    .from('sellers')
    .select('identity_verified')
    .eq('id', profile.seller_id)
    .single()

  // Si l'identité n'est pas validée, rediriger vers la page d'attente de validation
  if (!seller?.identity_verified) {
    return NextResponse.redirect(new URL('/seller/pending', request.url))
  }

  return NextResponse.next()
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