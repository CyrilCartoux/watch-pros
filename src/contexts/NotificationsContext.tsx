"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface NotificationsContextType {
  unreadCount: number
  fetchUnreadCount: () => Promise<void>
  isPolling: boolean
  startPolling: () => void
  stopPolling: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isPolling, setIsPolling] = useState(true)

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    try {
      const response = await fetch('/api/notifications/count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      } else {
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Failed to fetch unread notifications count:', error)
      setUnreadCount(0)
    }
  }, [user])

  useEffect(() => {
    if (user && isPolling) {
      fetchUnreadCount()
      const interval = setInterval(fetchUnreadCount, 60000) // Poll every 60 seconds
      return () => clearInterval(interval)
    }
  }, [user, isPolling, fetchUnreadCount])

  const startPolling = () => setIsPolling(true)
  const stopPolling = () => setIsPolling(false)

  const value = { unreadCount, fetchUnreadCount, isPolling, startPolling, stopPolling }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return context
} 