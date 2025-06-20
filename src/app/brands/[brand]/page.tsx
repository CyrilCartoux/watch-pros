"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import brandsData from "@/data/brands.json"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/components/ListingCard"
import { useFavorites } from "@/hooks/useFavorites"
import { Skeleton } from "@/components/ui/skeleton"

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

// Copied from listings/page.tsx for consistency
interface ListingImage {
  id: string
  url: string
  order_index: number
}

interface Listing {
  id: string
  reference_id: string
  seller_id: string
  brand_id: string
  model_id: string
  reference: string
  title: string
  description: string | null
  year: string | null
  serial_number: string | null
  dial_color: string | null
  diameter_min: number | null
  diameter_max: number | null
  movement: string | null
  case_material: string | null
  bracelet_material: string | null
  bracelet_color: string | null
  included: string | null
  condition: string
  price: number
  currency: string
  shipping_delay: string
  status: string
  created_at: string
  updated_at: string
  listing_type: string
  brands: any | null
  models: {
    slug: string
    label: string
    popular: boolean
  } | null
  listing_images: ListingImage[]
  seller: {
    id: string
    company_name: string
    watch_pros_name: string
    company_logo_url: string | null
    crypto_friendly: boolean
  } | null
}

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brandInfo = brandsData[params.brand as keyof typeof brandsData] as BrandData
  
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()

  useEffect(() => {
    if (!brandInfo) {
      setIsLoading(false)
      return
    }

    const fetchListings = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Use the brand name from the static data to query the listings API
        const response = await fetch(`/api/listings?query=${encodeURIComponent(brandInfo.name)}&listingType=watch`)
        if (!response.ok) {
          throw new Error(`Failed to fetch listings for ${brandInfo.name}`)
        }
        const data = await response.json()
        setListings(data.listings || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [params.brand, brandInfo])

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
            {/* Available Listings */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">Available Listings for {brandInfo.name}</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <Skeleton className="bg-muted h-64 rounded-lg mb-4" />
                      <div className="space-y-3">
                        <Skeleton className="h-4 bg-muted rounded w-3/4" />
                        <Skeleton className="h-4 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <Card className="bg-destructive/10">
                  <CardContent className="p-6 text-center text-destructive">
                    <p className="font-medium">Error loading listings</p>
                    <p className="text-sm">{error}</p>
                  </CardContent>
                </Card>
              ) : listings.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {listings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        isFavorite={isFavorite(listing.id)}
                        onFavoriteClick={() => {
                          if (isFavorite(listing.id)) {
                            removeFavorite(listing.id)
                          } else {
                            addFavorite(listing.id)
                          }
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-8 text-center">
                    <Button asChild size="lg">
                      <Link href={`/listings?query=${encodeURIComponent(brandInfo.name)}&listingType=watch`}>
                        See all listings
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <Card className="bg-card">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No active listings for {brandInfo.name} at the moment.</p>
                    <Button asChild size="lg" className="mt-4">
                        <Link href={`/listings`}>
                          Browse all listings
                        </Link>
                      </Button>
                  </CardContent>
                </Card>
              )}
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