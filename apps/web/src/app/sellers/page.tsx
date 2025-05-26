"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Award, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import sellersData from "@/data/sellers.json"

interface Seller {
  id: string
  name: string
  logo: string
  type: string
  description: string
  location: {
    city: string
    country: string
  }
  stats: {
    totalSales: number
    rating: number
    totalReviews: number
    recommendationRate: number
  }
  certifications: {
    name: string
    icon: "shield-check" | "award"
  }[]
}

export default function SellersPage() {
  const sellers = Object.values(sellersData) as Seller[]

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Vendeurs Certifiés</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de vendeurs professionnels certifiés, experts en montres de luxe.
            Chaque vendeur est rigoureusement sélectionné pour garantir une expérience d'achat exceptionnelle.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10">
            Tous les vendeurs
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            Avec boutique physique
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            Expert Rolex
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10">
            Expert Patek Philippe
          </Badge>
        </div>

        {/* Liste des vendeurs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellers.map((seller) => (
            <Link key={seller.id} href={`/sellers/${seller.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-background">
                      <Image
                        src={seller.logo}
                        alt={`${seller.name} logo`}
                        width={80}
                        height={80}
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{seller.name}</h2>
                      <p className="text-sm text-muted-foreground mb-2">{seller.type}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">{seller.stats.rating}</span>
                          <span className="text-sm text-muted-foreground">({seller.stats.totalReviews})</span>
                        </div>
                        <Badge variant="secondary">{seller.stats.recommendationRate}% recommandent</Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {seller.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {seller.location.city}, {seller.location.country}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {seller.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-1">
                        {cert.icon === "shield-check" ? (
                          <Shield className="h-4 w-4 text-primary" />
                        ) : (
                          <Award className="h-4 w-4 text-primary" />
                        )}
                        <span className="text-sm">{cert.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {seller.stats.totalSales} montres vendues
                      </span>
                      <span className="text-sm font-medium text-primary">
                        Voir le profil →
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
} 