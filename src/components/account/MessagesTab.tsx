"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { debounce } from "lodash"

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  read: boolean
  pending?: boolean
}

interface Conversation {
  id: string
  participant1_id: string
  participant2_id: string
  created_at: string
  last_message?: Message
  other_user?: {
    id: string
    name: string
    avatar_url: string | null
    seller_since: string
    company_name?: string
    full_name?: string
    company_status?: string
    seller?: {
      watch_pros_name: string
      company_status: string
      company_logo_url: string | null
    }
  }
  messages?: Message[]
}

function useChatScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  return { containerRef, scrollToBottom }
}

export function MessagesTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showMobileConversation, setShowMobileConversation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = useMemo(() => createClient(), [])
  const unreadMessageIds = useRef<string[]>([])
  const debouncedMarkAsRead = useMemo(
    () => debounce(async () => {
      if (unreadMessageIds.current.length === 0) return

      const idsToMark = [...unreadMessageIds.current]
      unreadMessageIds.current = []

      try {
        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .in('id', idsToMark)

        if (error) {
          console.error('Failed to mark messages as read:', error)
          // Retry after delay
          setTimeout(() => {
            unreadMessageIds.current = [...idsToMark, ...unreadMessageIds.current]
            debouncedMarkAsRead()
          }, 2000)
        }
      } catch (err) {
        console.error('Error marking messages as read:', err)
      }
    }, 1000),
    [supabase]
  )
  const [pendingMessages, setPendingMessages] = useState<Set<string>>(new Set())
  const isMounted = useRef(true)
  const [channel, setChannel] = useState<ReturnType<typeof supabase.channel> | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { containerRef, scrollToBottom } = useChatScroll()

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Load conversations
  useEffect(() => {
    if (!user) return
    loadConversations()
  }, [user, supabase])

  async function loadConversations(reset = true) {
    try {
      if (reset) {
        setOffset(0)
        setHasMore(true)
      }
      
      const { data, error, count } = await supabase
        .from('conversations')
        .select(`
          *,
          messages:messages(
            id,
            content,
            created_at,
            sender_id,
            read
          ),
          participant1:profiles!conversations_participant1_id_fkey(
            id,
            first_name,
            last_name,
            seller_id,
            seller:sellers!inner(
              watch_pros_name,
              company_status,
              company_logo_url
            )
          ),
          participant2:profiles!conversations_participant2_id_fkey(
            id,
            first_name,
            last_name,
            seller_id,
            seller:sellers!inner(
              watch_pros_name,
              company_status,
              company_logo_url
            )
          )
        `, { count: 'exact' })
        .order('updated_at', { ascending: false })
        .range(offset, offset + 19)

      if (error) throw error

      const formattedConversations = data.map((conv: any) => ({
        ...conv,
        last_message: conv.messages?.[0],
        other_user: conv.participant1_id === user?.id ? {
          ...conv.participant2,
          avatar_url: conv.participant2.seller?.company_logo_url
        } : {
          ...conv.participant1,
          avatar_url: conv.participant1.seller?.company_logo_url
        }
      }))

      setConversations(prev => reset ? formattedConversations : [...prev, ...formattedConversations])
      setHasMore(data.length === 20)
      setOffset(prev => prev + 20)
    } catch (err) {
      console.error('Error loading conversations:', err)
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    await loadConversations(false)
  }

  // Subscribe to new messages
  useEffect(() => {
    if (!user || !selectedConversation) return

    const newChannel = supabase.channel(`conversation:${selectedConversation.id}`)

    newChannel
      .on('broadcast', { event: 'message' }, (payload) => {
        const newMessage = payload.payload as Message
        console.log('Received broadcast message:', newMessage)
        
        // Update messages list
        setMessages(prev => {
          const newMessages = [...prev, newMessage]
          // Use nextTick for scroll
          queueMicrotask(() => {
            if (isMounted.current) {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
          })
          return newMessages
        })
        
        // Update last conversation
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id
              ? { ...conv, last_message: newMessage }
              : conv
          )
        )

        // Mark message as read if sent by other user
        if (newMessage.sender_id !== user.id) {
          unreadMessageIds.current.push(newMessage.id)
          debouncedMarkAsRead()
        }
      })
      .subscribe((status) => {
        console.log('Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          setIsConnected(true)
        }
      })

    setChannel(newChannel)

    return () => {
      console.log('Cleaning up channel subscription')
      supabase.removeChannel(newChannel)
    }
  }, [user, selectedConversation, supabase])

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    setLoadingMessages(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data)
      
      // Mark messages as read
      const unreadMessages = data.filter(
        (msg: Message) => !msg.read && msg.sender_id !== user?.id
      )
      
      if (unreadMessages.length > 0) {
        unreadMessageIds.current = unreadMessages.map(msg => msg.id)
        debouncedMarkAsRead()
      }
    } catch (err) {
      console.error('Error loading messages:', err)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation)
    setShowMobileConversation(true)
    await loadMessages(conversation.id)
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Effet pour scroller en bas quand les messages changent
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  // Effet pour scroller en bas quand une nouvelle conversation est sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom()
    }
  }, [selectedConversation, scrollToBottom])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || !user || !channel || !isConnected) return

    const messageContent = newMessage.trim()
    setNewMessage("")

    // Save old last message
    const oldLastMessage = selectedConversation.last_message

    // Create temporary message
    const tempId = 'temp-' + Date.now()
    const tempMessage: Message = {
      id: tempId,
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content: messageContent,
      created_at: new Date().toISOString(),
      read: false,
      pending: false
    }

    // Add message to UI immediately
    setPendingMessages(prev => new Set([...prev, tempId]))
    setMessages(prev => [...prev, tempMessage])
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id
          ? { ...conv, last_message: tempMessage }
          : conv
      )
    )

    try {
      // Send message through broadcast channel
      await channel.send({
        type: 'broadcast',
        event: 'message',
        payload: tempMessage
      })

      // Save message to database
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: messageContent
        })
        .select()
        .single()

      if (error) throw error

      // Replace temporary message with real message
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempId ? data : msg
        )
      )
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id
            ? { ...conv, last_message: data }
            : conv
        )
      )
      setPendingMessages(prev => {
        const next = new Set(prev)
        next.delete(tempId)
        return next
      })
    } catch (err) {
      console.error('Error sending message:', err)
      if (isMounted.current) {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        })
        // Remove temporary message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempId))
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id
              ? { ...conv, last_message: oldLastMessage }
              : conv
          )
        )
        setPendingMessages(prev => {
          const next = new Set(prev)
          next.delete(tempId)
          return next
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
      {/* Conversations list */}
      <div className={`md:col-span-1 border rounded-lg overflow-hidden flex flex-col h-full ${showMobileConversation ? 'hidden md:flex' : 'flex'}`}>
        {/* Filters */}
        <div className="p-4 border-b">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground">
              All
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y">
            {conversations.map((conversation) => (
              <button 
                key={conversation.id}
                className={`w-full p-4 hover:bg-muted/50 transition-colors text-left ${selectedConversation?.id === conversation.id ? 'bg-muted/50' : ''}`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={conversation.other_user?.avatar_url || undefined} />
                    <AvatarFallback>
                      {conversation.other_user?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium truncate">
                        {conversation.other_user?.seller?.watch_pros_name}
                      </p>
                      {conversation.last_message && (
                        <span className="text-sm text-muted-foreground">
                          {new Date(conversation.last_message.created_at).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Load more button */}
          {hasMore && (
            <div className="p-4 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full"
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Loading...
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Conversation details */}
      <div className={`md:col-span-2 border rounded-lg overflow-hidden flex flex-col h-full ${!showMobileConversation ? 'hidden md:flex' : 'flex'}`}>
        {selectedConversation ? (
          <>
            {/* Header with seller info */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <button 
                  className="md:hidden p-2 hover:bg-muted rounded-full"
                  onClick={() => setShowMobileConversation(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Link href={`/sellers/${selectedConversation.other_user?.seller?.watch_pros_name}`} className="flex items-center gap-3 flex-1">
                  <Avatar>
                    <AvatarImage src={selectedConversation.other_user?.avatar_url || undefined} />
                    <AvatarFallback>
                      {selectedConversation.other_user?.name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {selectedConversation.other_user?.seller?.watch_pros_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.other_user?.seller?.company_status}
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Messages */}
            <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex gap-3 ${message.sender_id === user?.id ? "justify-end" : ""}`}
                    >
                      {message.sender_id !== user?.id && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={selectedConversation.other_user?.avatar_url || undefined} />
                          <AvatarFallback>
                            {selectedConversation.other_user?.name?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`flex-1 ${message.sender_id === user?.id ? "max-w-[80%]" : ""}`}>
                        <div className={`rounded-lg p-3 ${
                          message.sender_id === user?.id 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        } ${message.pending ? "opacity-50" : ""}`}>
                          <p>{message.content}</p>
                          {message.pending && (
                            <div className="mt-1 flex justify-end">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                            </div>
                          )}
                        </div>
                        <span className={`text-xs text-muted-foreground mt-1 block ${
                          message.sender_id === user?.id ? "text-right" : ""
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input for new message */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start
          </div>
        )}
      </div>
    </div>
  )
} 