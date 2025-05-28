"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, TrendingUp, ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

// Mock data pour les notifications
const mockNotifications = {
  active: {
    listings: [
      {
        id: 1,
        title: "Rolex Submariner 2023",
        price: 12500,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop",
        seller: {
          name: "John Doe",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
        },
        notifications: {
          priceUpdates: true,
          sold: true
        },
        lastUpdate: "2024-03-20T10:30:00"
      },
      {
        id: 2,
        title: "Omega Seamaster 300M",
        price: 8900,
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop",
        seller: {
          name: "Jane Smith",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        },
        notifications: {
          priceUpdates: true,
          sold: false
        },
        lastUpdate: "2024-03-19T15:45:00"
      }
    ],
    models: [
      {
        id: 1,
        name: "Rolex Submariner",
        brand: "Rolex",
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop",
        notifications: {
          newListings: true
        },
        lastUpdate: "2024-03-20T09:15:00"
      },
      {
        id: 2,
        name: "Omega Seamaster 300M",
        brand: "Omega",
        image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop",
        notifications: {
          newListings: true
        },
        lastUpdate: "2024-03-19T14:30:00"
      }
    ]
  },
  history: [
    {
      id: 1,
      type: "price_update",
      title: "Rolex Submariner 2023",
      message: "Le prix a baissé de 500€",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop",
      date: "2024-03-20T10:30:00",
      read: false
    },
    {
      id: 2,
      type: "new_listing",
      title: "Omega Seamaster 300M",
      message: "Une nouvelle annonce correspond à vos critères",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop",
      date: "2024-03-19T15:45:00",
      read: true
    },
    {
      id: 3,
      type: "sold",
      title: "Rolex Submariner 2023",
      message: "Cette montre a été vendue",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop",
      date: "2024-03-18T09:15:00",
      read: true
    }
  ]
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAsRead = (id: number) => {
    setNotifications(prev => ({
      ...prev,
      history: prev.history.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    }))
  }

  const markAllAsRead = () => {
    setNotifications(prev => ({
      ...prev,
      history: prev.history.map(notification => ({ ...notification, read: true }))
    }))
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => ({
      ...prev,
      history: prev.history.filter(notification => notification.id !== id)
    }))
  }

  const toggleListingNotification = (listingId: number, type: 'priceUpdates' | 'sold') => {
    setNotifications(prev => ({
      ...prev,
      active: {
        ...prev.active,
        listings: prev.active.listings.map(listing => {
          if (listing.id === listingId) {
            return {
              ...listing,
              notifications: {
                ...listing.notifications,
                [type]: !listing.notifications[type]
              }
            }
          }
          return listing
        })
      }
    }))
  }

  const toggleModelNotification = (modelId: number, type: 'newListings') => {
    setNotifications(prev => ({
      ...prev,
      active: {
        ...prev.active,
        models: prev.active.models.map(model => {
          if (model.id === modelId) {
            return {
              ...model,
              notifications: {
                ...model.notifications,
                [type]: !model.notifications[type]
              }
            }
          }
          return model
        })
      }
    }))
  }

  return (
    <div className="container py-4 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Centre de notifications</h1>
        <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full sm:w-auto">
          Tout marquer comme lu
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-4 md:space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="active" className="flex-1 sm:flex-none">Alertes actives</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 sm:flex-none">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6 md:space-y-8">
          {/* Alertes sur les annonces */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">Alertes sur les annonces</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {notifications.active.listings.map((listing) => (
                <Card key={listing.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex gap-3 md:gap-4">
                      <Link href={`/listings/${listing.id}`} className="relative w-20 h-20 md:w-24 md:h-24">
                        <Image
                          src={listing.image}
                          alt={listing.title}
                          fill
                          className="rounded-md object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${listing.id}`} className="hover:underline">
                          <h3 className="font-medium truncate text-sm md:text-base">{listing.title}</h3>
                        </Link>
                        <p className="text-base md:text-lg font-bold mt-1">{listing.price.toLocaleString()} €</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Image
                            src={listing.seller.avatar}
                            alt={listing.seller.name}
                            width={20}
                            height={20}
                            className="rounded-full md:w-6 md:h-6"
                          />
                          <p className="text-xs md:text-sm text-muted-foreground">{listing.seller.name}</p>
                        </div>
                        <div className="mt-3 md:mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                              <span className="text-xs md:text-sm">Mises à jour de prix</span>
                            </div>
                            <Switch
                              checked={listing.notifications.priceUpdates}
                              onCheckedChange={() => toggleListingNotification(listing.id, 'priceUpdates')}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                              <span className="text-xs md:text-sm">Vendue</span>
                            </div>
                            <Switch
                              checked={listing.notifications.sold}
                              onCheckedChange={() => toggleListingNotification(listing.id, 'sold')}
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

          {/* Alertes sur les modèles */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-4">Alertes sur les modèles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {notifications.active.models.map((model) => (
                <Card key={model.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-3 md:p-4">
                    <div className="flex gap-3 md:gap-4">
                      <Link href={`/models/${model.id}`} className="relative w-20 h-20 md:w-24 md:h-24">
                        <Image
                          src={model.image}
                          alt={model.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/models/${model.id}`} className="hover:underline">
                          <h3 className="font-medium truncate text-sm md:text-base">{model.name}</h3>
                        </Link>
                        <p className="text-xs md:text-sm text-muted-foreground">{model.brand}</p>
                        <div className="mt-3 md:mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bell className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                              <span className="text-xs md:text-sm">Nouvelles annonces</span>
                            </div>
                            <Switch
                              checked={model.notifications.newListings}
                              onCheckedChange={() => toggleModelNotification(model.id, 'newListings')}
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
          {notifications.history.map((notification) => (
            <Card key={notification.id} className={`hover:bg-muted/50 transition-colors ${!notification.read ? 'border-primary/50' : ''}`}>
              <CardContent className="p-3 md:p-4">
                <div className="flex gap-3 md:gap-4">
                  <Link href={`/listings/${notification.id}`} className="relative w-14 h-14 md:w-16 md:h-16">
                    <Image
                      src={notification.image}
                      alt={notification.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/listings/${notification.id}`} className="hover:underline">
                          <h3 className="font-medium text-sm md:text-base">{notification.title}</h3>
                        </Link>
                        <p className="text-xs md:text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                          <p className="text-xs md:text-sm text-muted-foreground">
                            {new Date(notification.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 md:h-10 md:w-10"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="sr-only">Marquer comme lu</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 md:h-10 md:w-10"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          <span className="sr-only">Supprimer</span>
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