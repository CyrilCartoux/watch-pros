'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthStatus {
  isAuthenticated: boolean
  isSeller: boolean
  isVerified: boolean
  isRejected: boolean
  hasActiveSubscription: boolean
  isAdmin: boolean
  isLoading: boolean
}

export function useAuthStatus() {
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isSeller: false,
    isVerified: false,
    isRejected: false,
    hasActiveSubscription: false,
    isAdmin: false,
    isLoading: true
  })
  const router = useRouter()

  useEffect(() => {
    async function checkStatus() {
      if (authLoading) return

      if (!user) {
        setStatus({
          isAuthenticated: false,
          isSeller: false,
          isVerified: false,
          isRejected: false,
          hasActiveSubscription: false,
          isAdmin: false,
          isLoading: false
        })
        return
      }

      try {
        const response = await fetch('/api/auth/status')
        if (!response.ok) {
          throw new Error('Failed to fetch auth status')
        }

        const data = await response.json()
        console.log({ data })
        setStatus({
          isAuthenticated: data.isAuthenticated,
          isSeller: data.isSeller,
          isVerified: data.isVerified,
          isRejected: data.isRejected,
          hasActiveSubscription: data.hasActiveSubscription,
          isAdmin: data.isAdmin,
          isLoading: false
        })
      } catch (error) {
        console.error('Error checking auth status:', error)
        setStatus({
          isAuthenticated: false,
          isSeller: false,
          isVerified: false,
          isRejected: false,
          hasActiveSubscription: false,
          isAdmin: false,
          isLoading: false
        })
      }
    }

    checkStatus()
  }, [user, authLoading])

  const requireAuth = () => {
    if (!status.isLoading && !status.isAuthenticated) {
      router.push('/auth')
      return false
    }
    return true
  }

  const requireSeller = () => {
    if (!status.isLoading && !status.isSeller) {
      router.push('/register')
      return false
    }
    return true
  }

  const requireVerified = () => {
    if (!status.isLoading && !status.isVerified) {
      router.push('/register/pending')
      return false
    }
    return true
  }

  const requireActiveSubscription = () => {
    if (!status.isLoading && !status.hasActiveSubscription) {
      router.push('/pricing')
      return false
    }
    return true
  }

  return {
    ...status,
    requireAuth,
    requireSeller,
    requireVerified,
    requireActiveSubscription
  }
} 