import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

type AuthGuardProps = {
  requireAuth?: boolean
  requireSeller?: boolean
  requireVerified?: boolean
}

export function useAuthGuard({ requireAuth = false, requireSeller = false, requireVerified = false }: AuthGuardProps = {}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkPermissions = async () => {
      if (loading) return

      // Si l'authentification est requise et l'utilisateur n'est pas connecté
      console.log('requireAuth', requireAuth)
      console.log('user', user)
      if (requireAuth && !user) {
        router.push('/auth')
        return
      }

      // Si l'utilisateur est connecté et que des permissions supplémentaires sont requises
      if (user && (requireSeller || requireVerified)) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('seller_id')
          .eq('id', user.id)
          .single()
        console.log('profile', profile)

        // Si une identité de vendeur est requise mais l'utilisateur n'en a pas
        if (requireSeller && !profile?.seller_id) {
          router.push('/seller/register')
          return
        }

        // Si la vérification est requise
        if (requireVerified && profile?.seller_id) {
          const { data: seller } = await supabase
            .from('sellers')
            .select('identity_verified')
            .eq('id', profile.seller_id)
            .single()

          if (!seller?.identity_verified) {
            router.push('/seller/pending')
            return
          }
        }
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkPermissions()
  }, [user, loading, requireAuth, requireSeller, requireVerified, router])

  return { isAuthorized, isLoading }
} 