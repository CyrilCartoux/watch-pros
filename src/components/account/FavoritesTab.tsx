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
    </div>
  )
} 