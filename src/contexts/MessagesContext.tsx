"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { createClient } from '@/lib/supabase/client'

interface MessagesContextType {
  unreadCount: number
  fetchUnreadCount: () => Promise<void>
  isPolling: boolean
  startPolling: () => void
  stopPolling: () => void
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined)

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [isPolling, setIsPolling] = useState(true)

  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    try {
      const supabase = createClient()
      
      // Simple approach: get all conversations for the user first
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)

      if (convError) {
        console.error('Failed to fetch conversations:', convError)
        setUnreadCount(0)
        return
      }

      if (!conversations || conversations.length === 0) {
        setUnreadCount(0)
        return
      }

      // Get unread messages for these conversations
      const conversationIds = conversations.map(c => c.id)
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('id')
        .in('conversation_id', conversationIds)
        .eq('read', false)
        .neq('sender_id', user.id)

      if (msgError) {
        console.error('Failed to fetch messages:', msgError)
        setUnreadCount(0)
        return
      }

      const count = messages?.length || 0
      console.log('Unread messages count:', count, 'for user:', user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error('Failed to fetch unread messages count:', error)
      setUnreadCount(0)
    }
  }, [user])

  // Real-time subscription for new messages
  useEffect(() => {
    if (!user || !isPolling) return

    const supabase = createClient()
    
    // Initial fetch with a small delay to ensure user is loaded
    const initialFetch = setTimeout(() => {
      fetchUnreadCount()
    }, 1000)
    
    // Subscribe to new messages
    const channel = supabase.channel('unread-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=neq.${user.id}`
      }, (payload) => {
        console.log('New message received:', payload)
        // Check if the message is for the current user
        const newMessage = payload.new as any
        if (newMessage && !newMessage.read) {
          // Fetch the conversation to check if user is participant
          supabase
            .from('conversations')
            .select('participant1_id, participant2_id')
            .eq('id', newMessage.conversation_id)
            .single()
            .then(({ data: conv }) => {
              if (conv && (conv.participant1_id === user.id || conv.participant2_id === user.id)) {
                console.log('Incrementing unread count for user')
                setUnreadCount(prev => prev + 1)
              }
            })
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=neq.${user.id}`
      }, (payload) => {
        console.log('Message updated:', payload)
        // Refresh count when messages are marked as read
        fetchUnreadCount()
      })
      .subscribe()

    // Polling fallback every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => {
      clearTimeout(initialFetch)
      supabase.removeChannel(channel)
      clearInterval(interval)
    }
  }, [user, isPolling, fetchUnreadCount])

  const startPolling = () => setIsPolling(true)
  const stopPolling = () => setIsPolling(false)

  const value = { unreadCount, fetchUnreadCount, isPolling, startPolling, stopPolling }

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  const context = useContext(MessagesContext)
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessagesProvider')
  }
  return context
} 