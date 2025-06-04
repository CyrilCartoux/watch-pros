"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, TrendingUp, ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { NotificationType } from "@/types/db/notifications/Notifications"
import { Skeleton } from "@/components/ui/skeleton"

type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  is_read: boolean
  created_at: string
  listing?: {
    id: string
    title: string
    price: number
    currency: string
    status: string
    brand: {
      id: string
      slug: string
      label: string
    }
    model: {
      id: string
      slug: string
      label: string
    }
  }
  model?: {
    id: string
    slug: string
    label: string
    brand: {
      id: string
      slug: string
      label: string
    }
  }
}

type ListingSubscription = {
  id: string
  created_at: string
  listing: {
    id: string
    title: string
    price: number
    currency: string
    status: string
    brand: {
      id: string
      slug: string
      label: string
    }
    model: {
      id: string
      slug: string
      label: string
    }
  }
}

type ModelSubscription = {
  id: string
  created_at: string
  model: {
    id: string
    slug: string
    label: string
    brand: {
      id: string
      slug: string
      label: string
    }
  }
}

function NotificationSkeleton() {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-3 md:p-4">
        <div className="flex gap-3 md:gap-4">
          <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
                <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ListingSubscriptionSkeleton() {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-3 md:p-4">
        <div className="flex gap-3 md:gap-4">
          <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-md" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-1/3 mt-1" />
            <div className="mt-3 md:mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ModelSubscriptionSkeleton() {
  return (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-3 md:p-4">
        <div className="flex gap-3 md:gap-4">
          <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-md" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/3 mt-1" />
            <div className="mt-3 md:mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [listingSubscriptions, setListingSubscriptions] = useState<ListingSubscription[]>([])
  const [modelSubscriptions, setModelSubscriptions] = useState<ModelSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (!response.ok) throw new Error('Failed to fetch notifications')
      const data = await response.json()
      setNotifications(data.notifications)
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError('Failed to load notifications')
    }
  }

  // Fetch listing subscriptions
  const fetchListingSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscribe-listing')
      if (!response.ok) throw new Error('Failed to fetch listing subscriptions')
      const data = await response.json()
      setListingSubscriptions(data.subscriptions)
    } catch (err) {
      console.error('Error fetching listing subscriptions:', err)
      setError('Failed to load listing subscriptions')
    }
  }

  // Fetch model subscriptions
  const fetchModelSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscribe-model')
      if (!response.ok) throw new Error('Failed to fetch model subscriptions')
      const data = await response.json()
      setModelSubscriptions(data.subscriptions)
    } catch (err) {
      console.error('Error fetching model subscriptions:', err)
      setError('Failed to load model subscriptions')
    }
  }

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([
        fetchNotifications(),
        fetchListingSubscriptions(),
        fetchModelSubscriptions()
      ])
      setLoading(false)
    }
    fetchData()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/read?id=${id}`, {
        method: 'PATCH'
      })
      if (!response.ok) throw new Error('Failed to mark notification as read')
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
      setError('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter(n => !n.is_read)
          .map(n => markAsRead(n.id))
      )
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      setError('Failed to mark all notifications as read')
    }
  }

  const removeNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete notification')
      
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
      )
    } catch (err) {
      console.error('Error deleting notification:', err)
      setError('Failed to delete notification')
    }
  }

  const toggleListingSubscription = async (listingId: string) => {
    try {
      const isSubscribed = listingSubscriptions.some(sub => sub.listing.id === listingId)
      const response = await fetch('/api/subscribe-listing', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: listingId })
      })
      
      if (!response.ok) throw new Error('Failed to toggle listing subscription')
      
      if (isSubscribed) {
        setListingSubscriptions(prev =>
          prev.filter(sub => sub.listing.id !== listingId)
        )
      } else {
        await fetchListingSubscriptions()
      }
    } catch (err) {
      console.error('Error toggling listing subscription:', err)
      setError('Failed to toggle listing subscription')
    }
  }

  const toggleModelSubscription = async (modelId: string) => {
    try {
      const isSubscribed = modelSubscriptions.some(sub => sub.model.id === modelId)
      const response = await fetch('/api/subscribe-model', {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model_id: modelId })
      })
      
      if (!response.ok) throw new Error('Failed to toggle model subscription')
      
      if (isSubscribed) {
        setModelSubscriptions(prev =>
          prev.filter(sub => sub.model.id !== modelId)
        )
      } else {
        await fetchModelSubscriptions()
      }
    } catch (err) {
      console.error('Error toggling model subscription:', err)
      setError('Failed to toggle model subscription')
    }
  }

  if (loading) {
    return (
      <div className="container py-4 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>

        <Tabs defaultValue="active" className="space-y-4 md:space-y-6">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="active" className="flex-1 sm:flex-none">Active Alerts</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 sm:flex-none">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6 md:space-y-8">
            {/* Listing Alerts */}
            <div>
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3].map((i) => (
                  <ListingSubscriptionSkeleton key={i} />
                ))}
              </div>
            </div>

            {/* Model Alerts */}
            <div>
              <Skeleton className="h-7 w-40 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3].map((i) => (
                  <ModelSubscriptionSkeleton key={i} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-3 md:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <NotificationSkeleton key={i} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-4 md:py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Notification Center</h1>
        <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full sm:w-auto">
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4 md:space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="active" className="flex-1 sm:flex-none">Active Alerts</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 sm:flex-none">History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6 md:space-y-8">
          {/* Listing Alerts */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">Listing Alerts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {listingSubscriptions.map((subscription) => (
                <Card key={subscription.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex gap-3 md:gap-4">
                      <Link href={`/listings/${subscription.listing.id}`} className="relative w-20 h-20 md:w-24 md:h-24">
                        <Image
                          src={`/api/listings/${subscription.listing.id}/image`}
                          alt={subscription.listing.title}
                          fill
                          className="rounded-md object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${subscription.listing.id}`} className="hover:underline">
                          <h3 className="font-medium truncate text-sm md:text-base">{subscription.listing.title}</h3>
                        </Link>
                        <p className="text-base md:text-lg font-bold mt-1">
                          {subscription.listing.price.toLocaleString()} {subscription.listing.currency}
                        </p>
                        <div className="mt-3 md:mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                              <span className="text-xs md:text-sm">Price updates</span>
                            </div>
                            <Switch
                              checked={true}
                              onCheckedChange={() => toggleListingSubscription(subscription.listing.id)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                              <span className="text-xs md:text-sm">Sold</span>
                            </div>
                            <Switch
                              checked={true}
                              onCheckedChange={() => toggleListingSubscription(subscription.listing.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Model Alerts */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">Model Alerts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {modelSubscriptions.map((subscription) => (
                <Card key={subscription.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex gap-3 md:gap-4">
                      <Link href={`/models/${subscription.model.id}`} className="relative w-20 h-20 md:w-24 md:h-24">
                        <Image
                          src={`/api/models/${subscription.model.id}/image`}
                          alt={subscription.model.label}
                          fill
                          className="rounded-md object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/models/${subscription.model.id}`} className="hover:underline">
                          <h3 className="font-medium truncate text-sm md:text-base">{subscription.model.label}</h3>
                        </Link>
                        <p className="text-xs md:text-sm text-muted-foreground">{subscription.model.brand.label}</p>
                        <div className="mt-3 md:mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bell className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                              <span className="text-xs md:text-sm">New listings</span>
                            </div>
                            <Switch
                              checked={true}
                              onCheckedChange={() => toggleModelSubscription(subscription.model.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-3 md:space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={`hover:bg-muted/50 transition-colors ${!notification.is_read ? 'border-primary/50' : ''}`}>
              <CardContent className="p-3 md:p-4">
                <div className="flex gap-3 md:gap-4">
                  <Link 
                    href={notification.listing ? `/listings/${notification.listing.id}` : `/models/${notification.model?.id}`} 
                    className="relative w-14 h-14 md:w-16 md:h-16"
                  >
                    <Image
                      src={notification.listing 
                        ? `/api/listings/${notification.listing.id}/image`
                        : `/api/models/${notification.model?.id}/image`
                      }
                      alt={notification.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          href={notification.listing 
                            ? `/listings/${notification.listing.id}` 
                            : `/models/${notification.model?.id}`
                          } 
                          className="hover:underline"
                        >
                          <h3 className="font-medium text-sm md:text-base">{notification.title}</h3>
                        </Link>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 md:h-10 md:w-10"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}