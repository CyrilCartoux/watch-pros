"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import brandsData from "@/data/brands.json"
import { useState, TouchEvent } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ListingCard } from "@/components/ListingCard"
import { Button } from "@/components/ui/button"

interface BrandData {
  name: string
  slug: string
  description: string
  logo: string
  overview: {
    title: string
    content: string[]
  }
  keyFeatures: string[]
  priceRange: {
    catalog: string
    secondary: string
  }
  featuredModels: {
    name: string
    description: string
    image: string
    price: string
    features: string[]
  }[]
  history: {
    title: string
    content: string[]
  }
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brandInfo = brandsData[params.brand as keyof typeof brandsData] as BrandData
  const [currentModel, setCurrentModel] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

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
      setCurrentModel((prev) => (prev === brandInfo.featuredModels.length - 1 ? 0 : prev + 1))
    }
    if (isRightSwipe) {
      setCurrentModel((prev) => (prev === 0 ? brandInfo.featuredModels.length - 1 : prev - 1))
    }
  }

  if (!brandInfo) {
    return <div>Brand not found</div>
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[200px] md:min-h-[420px] flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 py-6 md:py-16">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-white flex items-center justify-center p-3 md:p-4">
            <Image
              src={brandInfo.logo}
              alt={`${brandInfo.name} logo`}
              width={180}
              height={180}
              className="object-contain object-center"
              priority
            />
          </div>
          <h1 className="mt-4 md:mt-8 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground text-center">
            {brandInfo.name}
          </h1>
          <p className="mt-2 md:mt-4 text-sm md:text-lg text-muted-foreground text-center max-w-2xl px-4">
            {brandInfo.description}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/40 pointer-events-none" />
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-16">
        <div className="container">
          <div className="space-y-8 md:space-y-12">
            {/* Featured Models */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Featured Models</h2>
              {/* Mobile Version - Carousel */}
              <div className="md:hidden relative">
                <div 
                  className="relative"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <Carousel
                    className="w-full"
                  >
                    <CarouselContent className="-ml-4">
                      {brandInfo.featuredModels.map((model, index) => (
                        <CarouselItem key={index} className="pl-4 basis-4/5">
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-square">
                              <Image
                                src={model.image}
                                alt={model.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="text-lg font-semibold mb-2 text-foreground">
                                {model.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                {model.description}
                              </p>
                              <p className="font-medium text-primary">
                                {model.price}
                              </p>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-10" />
                    <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-10" />
                  </Carousel>
                </div>
              </div>

              {/* Desktop Version - Grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {brandInfo.featuredModels.map((model, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square">
                      <Image
                        src={model.image}
                        alt={model.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
                        {model.name}
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-4">
                        {model.description}
                      </p>
                      <p className="font-medium text-primary">
                        {model.price}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Listings */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Available Listings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Placeholder for listings */}
                <Card className="bg-card">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col items-center">
                      <Button asChild size="lg">
                        <Link href={`/listings?brand=${params.brand}`}>
                          Voir les listings
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-foreground">About {brandInfo.name}</h2>
          
          {/* Key Features */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-foreground mb-6">Key Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
              {brandInfo.keyFeatures.map((feature, index) => (
                <Card key={index} className="bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-2 md:p-6">
                    <div className="flex flex-col items-center text-center gap-1 md:flex-row md:items-start md:text-left md:gap-3">
                      <div className="w-6 h-6 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs md:text-base text-foreground line-clamp-2 md:line-clamp-3">{feature}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Brand Overview */}
            <div className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-semibold text-foreground mb-4">{brandInfo.overview.title}</h3>
                {brandInfo.overview.content.map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Key Features List */}
            <div className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-semibold text-foreground mb-4">Features</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {brandInfo.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-12 bg-card p-6 rounded-lg border">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Price Range</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-foreground mb-2">Retail Price (2023)</h4>
                <p className="text-muted-foreground">{brandInfo.priceRange.catalog}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Secondary Market</h4>
                <p className="text-muted-foreground">{brandInfo.priceRange.secondary}</p>
              </div>
            </div>
          </div>

          {/* Iconic Models */}
          <div className="mt-12 space-y-8">
            <h3 className="text-2xl font-semibold text-foreground">Iconic Models</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {brandInfo.featuredModels.map((model, index) => (
                <div key={index} className="bg-card p-6 rounded-lg border">
                  <h4 className="text-xl font-medium text-foreground mb-3">{model.name}</h4>
                  <p className="text-muted-foreground mb-4">{model.description}</p>
                  <div className="text-sm text-muted-foreground">
                    {model.features.map((feature, featureIndex) => (
                      <p key={featureIndex}>• {feature}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History Section */}
          <div className="mt-12 bg-card p-6 rounded-lg border">
            <h3 className="text-2xl font-semibold text-foreground mb-4">{brandInfo.history.title}</h3>
            <div className="space-y-4 text-muted-foreground">
              {brandInfo.history.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 