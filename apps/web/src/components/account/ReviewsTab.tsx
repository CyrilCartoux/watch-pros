"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

const mockReviews = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    },
    rating: 5,
    comment: "Excellent vendeur, très professionnel et réactif. La montre était exactement comme décrite.",
    date: "2024-03-15",
    listing: {
      title: "Rolex Submariner 2023",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&h=200&fit=crop"
    }
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    rating: 4,
    comment: "Très bon service, livraison rapide. La montre est en parfait état.",
    date: "2024-03-10",
    listing: {
      title: "Omega Seamaster 300M",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=200&h=200&fit=crop"
    }
  }
]

export function ReviewsTab() {
  return (
    <div className="space-y-6">
      {/* Résumé des avis */}
      <Card>
        <CardHeader>
          <CardTitle>Avis reçus</CardTitle>
          <CardDescription>Les retours de vos acheteurs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="h-8 w-8 fill-primary text-primary" />
              <p className="text-4xl font-bold">4.8</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Basé sur 123 avis</p>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= 4 ? "fill-primary text-primary" : "text-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des avis */}
      <div className="space-y-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Image
                    src={review.user.avatar}
                    alt={review.user.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{review.user.name}</p>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-primary text-primary" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Image
                      src={review.listing.image}
                      alt={review.listing.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <p className="text-sm font-medium">{review.listing.title}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 