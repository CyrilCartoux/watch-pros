"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useFavorites } from "@/hooks/useFavorites"
import { Skeleton } from "@/components/ui/skeleton"

export function FavoritesTab() {
  const { favorites, isLoading, error } = useFavorites()

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">An error occurred while loading favorites.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No favorites</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You haven't added any watches to your favorites yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Favorite Watches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((favorite) => (
            <Link href={`/listings/${favorite.listing_id}`} key={favorite.id}>
              <Card className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24">
                      <Image
                        src={favorite.listings.listing_images[0]?.url || "/placeholder-watch.jpg"}
                        alt={favorite.listings.title}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{favorite.listings.title}</h3>
                      <p className="text-lg font-bold mt-1">
                        {favorite.listings.price.toLocaleString()} {favorite.listings.currency}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-sm text-muted-foreground">
                          {favorite.listings.brands.label} {favorite.listings.models.label}
                        </p>
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