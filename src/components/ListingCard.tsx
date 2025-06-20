import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { useState, TouchEvent } from "react"
import { watchConditions } from "@/data/watch-conditions"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Coins } from "lucide-react"

interface ListingImage {
  id: string
  url: string
  order_index: number
}

interface ListingCardProps {
  listing: {
    id: string
    reference_id: string
    title: string
    reference: string
    year: string | null
    condition: string
    price: number
    currency: string
    shipping_delay: string
    listing_images: ListingImage[]
    models: {
      slug: string
      label: string
    } | null
    seller: {
      id: string
      company_name: string
      watch_pros_name: string
      company_logo_url: string | null
      crypto_friendly: boolean
    } | null
  }
  isFavorite: boolean
  onFavoriteClick: () => void
}

export function ListingCard({ listing, isFavorite, onFavoriteClick }: ListingCardProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const minSwipeDistance = 50
  const images = listing.listing_images || []
  const hasImages = images.length > 0

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add favorites",
        variant: "destructive",
      })
      return
    }

    onFavoriteClick()
  }

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!hasImages) return
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!hasImages) return
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
    if (!touchStart || !touchEnd || !hasImages) return

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

  // Get condition label
  const conditionLabel = watchConditions.find(c => c.slug === listing.condition)?.label
  const shippingDelayLabel = `${listing.shipping_delay} days` 

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
        <div 
          className="relative aspect-[3/4] md:aspect-[3/4] lg:aspect-[1] group"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {hasImages ? (
            <Image
              src={images[currentImage].url}
              alt={listing.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
          
          {/* Favorite Button */}
          <div className="absolute top-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleFavoriteClick}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isFavorite
                        ? "bg-red-500 hover:bg-red-600" 
                        : "bg-background/80 hover:bg-background/90"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "text-white fill-white" : "text-muted-foreground"}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFavorite 
                    ? "Remove from favorites" 
                    : "Add to favorites"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Navigation Buttons - Only show if there are multiple images */}
          {hasImages && images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next image"
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
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <CardContent className="p-2 md:p-4 flex-1 flex flex-col">
          <div className="space-y-2 md:space-y-3">
            {/* Seller Info */}
            {listing.seller && (
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/20 flex-shrink-0">
                  {listing.seller.company_logo_url ? (
                    <Image
                      src={listing.seller.company_logo_url}
                      alt={listing.seller.company_name}
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] font-bold text-primary">
                      {listing.seller.company_name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {listing.seller.watch_pros_name}
                </span>
                {listing.seller.crypto_friendly && (
                  <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 ml-auto">
                    <Coins className="h-3 w-3 mr-1" />
                    Crypto
                  </Badge>
                )}
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-sm md:text-lg line-clamp-2">{listing.title}</h3>

            {/* Tags and Price */}
            <div className="flex flex-col gap-1 md:gap-2">
              <div className="flex flex-wrap gap-1 md:gap-2">
                {listing.year && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-muted rounded-md text-[10px] md:text-xs">
                    {listing.year}
                  </span>
                )}
                {conditionLabel && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-muted rounded-md text-[10px] md:text-xs">
                    {conditionLabel}
                  </span>
                )}
                {listing.shipping_delay && (
                  <span className="px-1.5 py-0.5 md:px-2 md:py-1 bg-muted rounded-md text-[10px] md:text-xs">
                    {listing.shipping_delay} days
                  </span>
                )}
              </div>
              <p className="text-base md:text-xl font-bold mt-1 md:mt-2">{listing.price.toLocaleString()} {listing.currency}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 