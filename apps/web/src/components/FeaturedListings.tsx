"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"
import { useState, useEffect, TouchEvent } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import listingsData from "@/data/listings2.json"

// Convert listings data to the format we need
const listings = Object.entries(listingsData).map(([id, listing]) => ({
  id,
  title: `${listing.brand} ${listing.model}`,
  reference: listing.reference,
  year: listing.year.toString(),
  price: listing.price.toLocaleString('fr-FR'),
  condition: listing.condition,
  images: listing.images,
  href: `/listings/${id}`
}))

export function FeaturedListings() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: string]: number }>({})

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
    setIsDragging(true)
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
      setCurrentIndex((prev) => (prev === listings.length - 1 ? 0 : prev + 1))
    }
    if (isRightSwipe) {
      setCurrentIndex((prev) => (prev === 0 ? listings.length - 1 : prev - 1))
    }

    setIsDragging(false)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === listings.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? listings.length - 1 : prev - 1))
  }

  const nextImage = (listingId: string, totalImages: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) + 1) % totalImages
    }))
  }

  const prevImage = (listingId: string, totalImages: number) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [listingId]: ((prev[listingId] || 0) - 1 + totalImages) % totalImages
    }))
  }

  const onImageTouchStart = (e: React.TouchEvent<HTMLDivElement>, listingId: string, totalImages: number) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onImageTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onImageTouchEnd = (listingId: string, totalImages: number) => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextImage(listingId, totalImages)
    }
    if (isRightSwipe) {
      prevImage(listingId, totalImages)
    }
  }

  const renderImageCarousel = (listing: typeof listings[0]) => {
    const currentImageIndex = currentImageIndexes[listing.id] || 0
    const totalImages = listing.images.length

    return (
      <div className="relative group">
        <div 
          className="relative aspect-square overflow-hidden"
          onTouchStart={(e) => onImageTouchStart(e, listing.id, totalImages)}
          onTouchMove={onImageTouchMove}
          onTouchEnd={() => onImageTouchEnd(listing.id, totalImages)}
        >
          <Image
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300"
          />
          
          {/* Image Navigation Buttons */}
          {totalImages > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-8 h-8"
                onClick={(e) => {
                  e.preventDefault()
                  prevImage(listing.id, totalImages)
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-8 h-8"
                onClick={(e) => {
                  e.preventDefault()
                  nextImage(listing.id, totalImages)
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Dots */}
          {totalImages > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    currentImageIndex === index ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentImageIndexes(prev => ({
                      ...prev,
                      [listing.id]: index
                    }))
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            Featured Listings
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of exceptional timepieces from trusted dealers worldwide.
          </p>
        </div>

        {isMobile ? (
          // Mobile Carousel
          <div className="relative">
            <div 
              className="overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ 
                  transform: `translateX(-${currentIndex * 100}%)`,
                  touchAction: isDragging ? 'none' : 'auto'
                }}
              >
                {listings.map((listing) => (
                  <div key={listing.id} className="w-full flex-shrink-0 px-2">
                    <Link href={listing.href}>
                      <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                        {renderImageCarousel(listing)}
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1 text-foreground">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Ref. {listing.reference} • {listing.year}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-primary">{listing.price} €</span>
                            <span className="text-sm text-muted-foreground">
                              {listing.condition}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10 w-10 h-10"
              onClick={nextSlide}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
              {listings.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndex === index ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          // Desktop Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <Link key={listing.id} href={listing.href}>
                <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                  {renderImageCarousel(listing)}
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 text-foreground">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ref. {listing.reference} • {listing.year}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary">{listing.price} €</span>
                      <span className="text-sm text-muted-foreground">
                        {listing.condition}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View All Listings
          </Link>
        </div>
      </div>
    </section>
  )
} 