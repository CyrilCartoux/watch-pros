"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Bell, BellOff, TrendingUp, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

const mockFavorites = {
  watches: [
    {
      id: 1,
      title: "Rolex Submariner 2023",
      price: 12500,
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop",
      seller: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      },
      date: "2024-03-20",
      notifications: {
        priceUpdates: true,
        sold: true
      }
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
      date: "2024-03-19",
      notifications: {
        priceUpdates: true,
        sold: false
      }
    }
  ],
  models: [
    {
      id: 1,
      name: "Rolex Submariner",
      brand: "Rolex",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop",
      listings: 12,
      priceRange: {
        min: 8000,
        max: 15000
      }
    },
    {
      id: 2,
      name: "Omega Seamaster 300M",
      brand: "Omega",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop",
      listings: 8,
      priceRange: {
        min: 5000,
        max: 10000
      }
    }
  ]
}

export function FavoritesTab() {
  const [watches, setWatches] = useState(mockFavorites.watches)

  const toggleNotification = (watchId: number, type: 'priceUpdates' | 'sold') => {
    setWatches(watches.map(watch => {
      if (watch.id === watchId) {
        return {
          ...watch,
          notifications: {
            ...watch.notifications,
            [type]: !watch.notifications[type]
          }
        }
      }
      return watch
    }))
  }

  return (
    <div className="space-y-8">
      {/* Montres avec notifications */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Montres avec notifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watches.map((watch) => (
            <Card key={watch.id} className="hover:bg-muted/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24">
                    <Image
                      src={watch.image}
                      alt={watch.title}
                      fill
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{watch.title}</h3>
                    <p className="text-lg font-bold mt-1">{watch.price.toLocaleString()} €</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Image
                        src={watch.seller.avatar}
                        alt={watch.seller.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <p className="text-sm text-muted-foreground">{watch.seller.name}</p>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Mises à jour de prix</span>
                        </div>
                        <Switch
                          checked={watch.notifications.priceUpdates}
                          onCheckedChange={() => toggleNotification(watch.id, 'priceUpdates')}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Vendue</span>
                        </div>
                        <Switch
                          checked={watch.notifications.sold}
                          onCheckedChange={() => toggleNotification(watch.id, 'sold')}
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

      {/* Montres favorites */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Montres favorites</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFavorites.watches.map((watch) => (
            <Link href={`/listings/${watch.id}`} key={watch.id}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={watch.image}
                        alt={watch.title}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{watch.title}</h3>
                      <p className="text-lg font-bold mt-1">{watch.price.toLocaleString()} €</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Image
                          src={watch.seller.avatar}
                          alt={watch.seller.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <p className="text-sm text-muted-foreground">{watch.seller.name}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Modèles suivis */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Modèles suivis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFavorites.models.map((model) => (
            <Link href={`/models/${model.id}`} key={model.id}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={model.image}
                        alt={model.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{model.name}</h3>
                      <p className="text-sm text-muted-foreground">{model.brand}</p>
                      <p className="text-sm mt-2">
                        {model.listings} annonces • {model.priceRange.min.toLocaleString()} - {model.priceRange.max.toLocaleString()} €
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 