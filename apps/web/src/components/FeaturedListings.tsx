"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"
import { useState, useEffect, TouchEvent } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

const listings = [
  {
    id: 1,
    title: "Rolex Submariner Date",
    reference: "126610LN",
    year: "2023",
    price: "12,500",
    condition: "New",
    image: "/images/watches/submariner.jpg",
    href: "/listings/O5FLZ2"
  },
  {
    id: 2,
    title: "Patek Philippe Nautilus",
    reference: "5711/1A",
    year: "2022",
    price: "95,000",
    condition: "Like New",
    image: "/images/watches/nautilus.jpg",
    href: "/listings/2"
  },
  {
    id: 3,
    title: "Audemars Piguet Royal Oak",
    reference: "15500ST",
    year: "2023",
    price: "45,000",
    condition: "New",
    image: "/images/watches/royal-oak.jpg",
    href: "/listings/3"
  },
  {
    id: 4,
    title: "Omega Speedmaster Professional",
    reference: "310.30.42.50.01.001",
    year: "2023",
    price: "6,500",
    condition: "New",
    image: "/images/watches/speedmaster.jpg",
    href: "/listings/4"
  }
]

export function FeaturedListings() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

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
                        <div className="relative aspect-square">
                          <Image
                            src={listing.image}
                            alt={listing.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1 text-foreground">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Ref. {listing.reference} • {listing.year}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-primary">${listing.price}</span>
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
                  <div className="relative aspect-square">
                    <Image
                      src={listing.image}
                      alt={listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 text-foreground">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ref. {listing.reference} • {listing.year}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary">${listing.price}</span>
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