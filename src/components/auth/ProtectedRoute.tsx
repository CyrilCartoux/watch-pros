'use client'

import { useAuthStatus } from '@/hooks/useAuthStatus'
import { useEffect, useState } from 'react'

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
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (isLoading) return

    const authorized = 
      (!requireAuth || checkAuth()) &&
      (!requireSeller || checkSeller()) &&
      (!requireVerified || checkVerified())

    setIsAuthorized(authorized)
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

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
} 