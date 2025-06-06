'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthStatus {
  isAuthenticated: boolean
  isSeller: boolean
  isVerified: boolean
  isLoading: boolean
}

export function useAuthStatus() {
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isSeller: false,
    isVerified: false,
    isLoading: true
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkStatus() {
      if (authLoading) return

      if (!user) {
        setStatus({
          isAuthenticated: false,
          isSeller: false,
          isVerified: false,
          isLoading: false
        })
        return
      }

      // Vérifier le profil vendeur
      const { data: profile } = await supabase
        .from('profiles')
        .select('seller_id')
        .eq('id', user.id)
        .single()

      if (!profile?.seller_id) {
        setStatus({
          isAuthenticated: true,
          isSeller: false,
          isVerified: false,
          isLoading: false
        })
        return
      }

      // Vérifier la validation d'identité
      const { data: seller } = await supabase
        .from('sellers')
        .select('identity_verified')
        .eq('id', profile.seller_id)
        .single()

      setStatus({
        isAuthenticated: true,
        isSeller: true,
        isVerified: seller?.identity_verified || false,
        isLoading: false
      })
    }

    checkStatus()
  }, [user, authLoading, supabase])

  const requireAuth = () => {
    if (!status.isLoading && !status.isAuthenticated) {
      router.push('/auth')
      return false
    }
    return true
  }

  const requireSeller = () => {
    if (!status.isLoading && !status.isSeller) {
      router.push('/auth')
      return false
    }
    return true
  }

  const requireVerified = () => {
    if (!status.isLoading && !status.isVerified) {
      router.push('/auth')
      return false
    }
    return true
  }

  return {
    ...status,
    requireAuth,
    requireSeller,
    requireVerified
  }
} 