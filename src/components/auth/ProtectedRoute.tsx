'use client'

import { useAuthStatus } from '@/hooks/useAuthStatus'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireSeller?: boolean
  requireVerified?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAuth = false,
  requireSeller = false,
  requireVerified = false 
}: ProtectedRouteProps) {
  const { 
    isLoading, 
    requireAuth: checkAuth, 
    requireSeller: checkSeller, 
    requireVerified: checkVerified 
  } = useAuthStatus()

  useEffect(() => {
    if (isLoading) return

    if (requireAuth && !checkAuth()) return
    if (requireSeller && !checkSeller()) return
    if (requireVerified && !checkVerified()) return
  }, [isLoading, requireAuth, requireSeller, requireVerified, checkAuth, checkSeller, checkVerified])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 