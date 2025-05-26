"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Share2, Shield, Clock, Package, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, TouchEvent } from "react"
import listingsData from "@/data/listings.json"
import brandsData from "@/data/brands.json"

interface ListingData {
  id: string
  brand: string
  model: string
  reference: string
  variant: string
  price: number
  shipping: {
    cost: number
    location: string
    method: string
  }
  condition: {
    status: string
    grade: string
    description: string
  }
  year: number
  included: string[]
  gender: string
  location: {
    country: string
    city: string
  }
  availability: string
  delivery: {
    estimated: {
      from: string
      to: string
    }
  }
  seller: {
    name: string
    type: string
    rating: number
    reviews: number
  }
  specifications: {
    movement: {
      type: string
      caliber: string
      base: string
      powerReserve: string
      jewels: number
    }
    case: {
      material: string
      diameter: string
      waterResistance: string
      bezel: string
      crystal: string
      dial: string
      numerals: string
    }
    bracelet: {
      material: string
      color: string
      clasp: string
      claspMaterial: string
    }
    functions: string[]
  }
  images: string[]
  description: {
    title: string
    content: string[]
    contact: {
      title: string
      content: string
    }
    shipping: {
      title: string
      content: string
    }
  }
  stats: {
    views: number
    period: string
  }
}

export default function ListingPage({ params }: { params: { id: string } }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [currentPopularModel, setCurrentPopularModel] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))
    }
    if (isRightSwipe) {
      setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))
    }
  }

  const listing = listingsData[params.id as keyof typeof listingsData] as ListingData
  const brandInfo = brandsData[listing.brand.toLowerCase().replace(/\s+/g, '-') as keyof typeof brandsData]

  if (!listing) {
    return <div>Listing non trouvé</div>
  }

  const nextPopularModel = () => {
    setCurrentPopularModel((prev) => 
      prev === brandInfo.featuredModels.length - 1 ? 0 : prev + 1
    )
  }

  const prevPopularModel = () => {
    setCurrentPopularModel((prev) => 
      prev === 0 ? brandInfo.featuredModels.length - 1 : prev - 1
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative aspect-square rounded-lg overflow-hidden bg-muted"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={listing.images[currentImage]}
                alt={`${listing.brand} ${listing.model}`}
                fill
                className="object-cover"
              />
              {/* Navigation Buttons */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
                onClick={() => setCurrentImage((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
                onClick={() => setCurrentImage((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    currentImage === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${listing.brand} ${listing.model} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{listing.brand} {listing.model}</h1>
                <p className="text-muted-foreground">{listing.reference} {listing.variant}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Price and Shipping */}
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-3xl font-bold">{listing.price.toLocaleString()} €</p>
                <p className="text-muted-foreground">+ {listing.shipping.cost} € {listing.shipping.method} : {listing.shipping.location}</p>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-primary hover:bg-primary/90">
                  Acheter
                </Button>
                <Button variant="outline" className="flex-1">
                  Proposer une offre
                </Button>
              </div>
            </div>

            {/* Status and Stats */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {listing.condition.status} ({listing.condition.grade}) | Année de fabrication {listing.year} | {listing.included.join(" | ")}
              </p>
              <p className="text-sm text-muted-foreground">{listing.stats.views} clics en {listing.stats.period}</p>
            </div>

            {/* Protection Cards */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Partner Certified inclus</h3>
                      <p className="text-sm text-muted-foreground">
                        Un horloger employé par le professionnel et agréé par nos soins a déjà certifié l'authenticité de cette montre.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold">Protection des Acheteurs</h3>
                      <p className="text-sm text-muted-foreground">
                        Avec la Protection des acheteurs, vous êtes entièrement couvert. En cas d'incident lors de votre commande, nous restons à vos côtés.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shipping and Seller */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{listing.availability}</p>
                      <p className="text-sm text-muted-foreground">Date de livraison estimée : {listing.delivery.estimated.from} - {listing.delivery.estimated.to}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    <Link href={`/sellers/${listing.seller.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:underline">
                      <div>
                        <p className="font-medium">{listing.seller.name}</p>
                        <p className="text-sm text-muted-foreground">{listing.seller.type} • {listing.seller.rating} ({listing.seller.reviews})</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technical Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Détails</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Données de base</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Code annonce</dt>
                      <dd>{listing.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Marque</dt>
                      <dd>{listing.brand}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Modèle</dt>
                      <dd>{listing.model}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Numéro de référence</dt>
                      <dd>{listing.reference}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Spécifications</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Mouvement</dt>
                      <dd>{listing.specifications.movement.type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Boîtier</dt>
                      <dd>{listing.specifications.case.material}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Matière du bracelet</dt>
                      <dd>{listing.specifications.bracelet.material}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Année de fabrication</dt>
                      <dd>{listing.year}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications Section */}
        <div className="mt-16 space-y-8">
          <h2 className="text-2xl font-bold">Spécifications détaillées</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Données de base */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Données de base</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Code annonce</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Marque</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.brand}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Modèle</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.model}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Numéro de référence</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.reference}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">État</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.condition.status} ({listing.condition.grade})</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Contenu livré</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.included.join(", ")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Sexe</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.gender}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Emplacement</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.location.city}, {listing.location.country}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Calibre */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Calibre</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Mouvement</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.movement.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Calibre/Rouages</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.movement.caliber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Base Calibre</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.movement.base}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Réserve de marche</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.movement.powerReserve}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Nombre de pierres</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.movement.jewels}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Boîtier */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Boîtier</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Matériau</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.case.material}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Diamètre</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.case.diameter}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Étanche</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.case.waterResistance}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Matériau de la lunette</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.case.bezel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Verre</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.case.crystal}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Cadran</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.case.dial}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Chiffres du cadran</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.case.numerals}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Bracelet */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Bracelet</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Matière</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.bracelet.material}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Couleur</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.bracelet.color}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Boucle</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.bracelet.clasp}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Matériau de la boucle</dt>
                    <dd className="font-medium truncate max-w-[200px] text-right">{listing.specifications.bracelet.claspMaterial}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Fonctions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Fonctions</h3>
                <ul className="space-y-2">
                  {listing.specifications.functions.map((function_, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span>{function_}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{listing.description.title}</h3>
              <div className="prose prose-sm max-w-none">
                <div className="space-y-2">
                  {listing.description.content.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <h4 className="font-semibold">{listing.description.contact.title}</h4>
                  <p>{listing.description.contact.content}</p>
                  <h4 className="font-semibold">{listing.description.shipping.title}</h4>
                  <p>{listing.description.shipping.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand Card */}
        <div className="mt-8">
          <Link href={`/brands/${brandInfo.slug}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image
                      src={brandInfo.logo}
                      alt={`${brandInfo.name} logo`}
                      width={64}
                      height={64}
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{brandInfo.name}</h3>
                    <p className="text-muted-foreground">Découvrir tous les modèles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Popular Models Carousel */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Autres montres populaires de {brandInfo.name}</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentPopularModel * 100}%)` }}>
                {brandInfo.featuredModels.map((model, index) => (
                  <div key={index} className="w-full md:w-1/3 flex-shrink-0 px-2">
                    <Card className="hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square">
                        <Image
                          src={model.image}
                          alt={`${brandInfo.name} ${model.name}`}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-semibold text-sm">{model.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">{model.description}</p>
                        <p className="font-medium text-primary text-sm">{model.price}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
              onClick={prevPopularModel}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
              onClick={nextPopularModel}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: Math.ceil(brandInfo.featuredModels.length / (isMobile ? 1 : 3)) }).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentPopularModel === index ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentPopularModel(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 