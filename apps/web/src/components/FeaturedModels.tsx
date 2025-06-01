"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Bell } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState, useEffect } from "react"

interface Brand {
  id: string
  slug: string
  label: string
  popular: boolean
}

interface Model {
  id: string
  brand_id: string
  slug: string
  label: string
  popular: boolean
}

export function FeaturedModels() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<{ [key: string]: Model[] }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Définir les marques et modèles spécifiques
  const targetBrands = ["rolex", "audemars-piguet", "patek-philippe"]
  const targetModels = [
    "datejust",
    "submariner",
    "daytona",
    "speedmaster",
    "royal-oak",
    "day-date",
    "nautilus",
    "gmt-master-ii"
  ]

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(`/api/brands?slugs=${targetBrands.join(",")}`)
        if (!response.ok) {
          throw new Error("Failed to fetch brands")
        }
        const data = await response.json()
        setBrands(data.brands)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch brands")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrands()
  }, [])

  // Fetch models for each brand
  useEffect(() => {
    const fetchModels = async () => {
      setIsLoadingModels(true)
      const modelsData: { [key: string]: Model[] } = {}
      
      for (const brand of brands) {
        try {
          const response = await fetch(`/api/models?brand_id=${brand.id}&slugs=${targetModels.join(",")}`)
          if (!response.ok) {
            throw new Error(`Failed to fetch models for ${brand.label}`)
          }
          const data = await response.json()
          modelsData[brand.id] = data.models
        } catch (err) {
          console.error(`Error fetching models for ${brand.label}:`, err)
        }
      }
      
      setModels(modelsData)
      setIsLoadingModels(false)
    }

    if (brands.length > 0) {
      fetchModels()
    }
  }, [brands])

  const toggleNotification = (modelSlug: string) => {
    setNotifications(prev => ({
      ...prev,
      [modelSlug]: !prev[modelSlug]
    }))
  }

  // Définir l'ordre des marques populaires
  const popularBrandsOrder = ["rolex", "audemars-piguet", "patek-philippe"]
  
  const featuredModels = brands
    .sort((a, b) => {
      const aIndex = popularBrandsOrder.indexOf(a.slug)
      const bIndex = popularBrandsOrder.indexOf(b.slug)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
    .flatMap(brand => (models[brand.id] || []).filter(model => targetModels.includes(model.slug)))

  if (isLoading || isLoadingModels) {
    return (
      <section className="py-8 md:py-16 bg-background">
        <div className="container">
          <div className="text-center mb-8 md:mb-12">
            <div className="h-8 w-64 bg-muted rounded mx-auto mb-4" />
            <div className="h-4 w-96 bg-muted rounded mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 md:py-16 bg-background">
        <div className="container">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-16 bg-background">
      <div className="container">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Featured Models</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Discover the most sought-after watch models and their characteristics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {featuredModels.map((model) => {
            const brand = brands.find(b => b.id === model.brand_id)
            return (
              <Link href={`/listings?brand=${brand?.slug}&model=${model.slug}`} key={model.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={`/images/watches/${model?.slug}.jpg`}
                      alt={`${brand?.label} ${model.label}`}
                      fill
                      className="object-contain p-4"
                    />
                    <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleNotification(model.slug)
                              }}
                              className={`p-1.5 md:p-2 rounded-full backdrop-blur-sm transition-colors ${
                                notifications[model.slug] 
                                  ? "bg-red-500 hover:bg-red-600" 
                                  : "bg-background/80 hover:bg-background/90"
                              }`}
                            >
                              <Bell className={`h-3 w-3 md:h-4 md:w-4 ${notifications[model.slug] ? "text-white" : "text-muted-foreground"}`} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {notifications[model.slug] 
                              ? "Disable notifications" 
                              : "Enable notifications"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <CardContent className="p-2 md:p-4">
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                      <span className="text-xs md:text-sm font-medium text-primary">{brand?.label}</span>
                    </div>
                    <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 line-clamp-1">{model.label}</h3>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-6 md:mt-8">
          <Link 
            href="/models" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 md:h-10 px-3 md:px-4 py-2"
          >
            View all models
          </Link>
        </div>
      </div>
    </section>
  )
}