import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, TouchEvent } from "react"

interface ListingCardProps {
  listing: {
    id: string
    brand: string
    model: string
    reference: string
    variant?: string
    price: number
    shipping: {
      cost: number
      location: string
    }
    condition: {
      status: string
      grade?: string
    }
    isCertified?: boolean
    isPopular?: boolean
    isSponsored?: boolean
    isPrivate?: boolean
    images?: string[]
    image?: string
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  // Utiliser les images si disponibles, sinon utiliser l'image unique, sinon utiliser une image par défaut
  console.log(listing);
  const images = listing.images || (listing.image ? [listing.image] : ['/images/placeholder.jpg'])
  console.log(images);
  const [currentImage, setCurrentImage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
    }
    if (isRightSwipe) {
      setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }
  }

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
        <div 
          className="relative aspect-square group"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={images[currentImage]}
            alt={`${listing.brand} ${listing.model}`}
            fill
            className="object-cover"
          />
          {listing.isPopular && (
            <Badge className="absolute top-2 left-2 bg-primary z-10">Populaire</Badge>
          )}
          
          {/* Navigation Buttons - Only show if there are multiple images */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Image précédente"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Image suivante"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dots Navigation */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImage(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentImage === index ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`Aller à l'image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  {listing.brand} {listing.model}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  Ref. {listing.reference} {listing.variant && `• ${listing.variant}`}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="font-semibold text-lg">{listing.price.toLocaleString()} €</p>
                <p className="text-sm text-muted-foreground">
                  {listing.shipping.cost > 0 
                    ? `+ ${listing.shipping.cost} € de frais de port`
                    : "Livraison gratuite"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
              {listing.isCertified && (
                <Badge variant="secondary">Certified</Badge>
              )}
              {listing.isSponsored && (
                <Badge variant="outline">Sponsorisée</Badge>
              )}
              {listing.isPrivate && (
                <Badge variant="outline">Vendeur particulier</Badge>
              )}
              <Badge variant="outline">{listing.condition.status}</Badge>
              <Badge variant="outline">{listing.shipping.location}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 