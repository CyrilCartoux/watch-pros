"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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

export default function ModelsPage() {
  const [activeTab, setActiveTab] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<{ [key: string]: Model[] }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands")
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
          const response = await fetch(`/api/models?brand_id=${brand.id}`)
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

  const filterAndSortModels = (brandId: string) => {
    const brandModels = models[brandId] || []
    return brandModels
      .filter(model => 
        model.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brands.find(b => b.id === model.brand_id)?.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }

  // Définir l'ordre des marques populaires
  const popularBrandsOrder = ["rolex", "audemars-piguet", "patek-philippe"]
  
  const featuredModels = brands
    .filter(brand => brand.popular)
    .sort((a, b) => {
      const aIndex = popularBrandsOrder.indexOf(a.slug)
      const bIndex = popularBrandsOrder.indexOf(b.slug)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
    .flatMap(brand => filterAndSortModels(brand.id))
    .filter(model => model.popular)

  const otherModels = brands
    .filter(brand => !brand.popular)
    .flatMap(brand => filterAndSortModels(brand.id))
    .concat(
      brands
        .filter(brand => brand.popular)
        .flatMap(brand => filterAndSortModels(brand.id))
        .filter(model => !model.popular)
    )

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-muted rounded" />
            <div className="h-4 w-96 bg-muted rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-square bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-6 w-48 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Popular Models</h1>
        <p className="text-muted-foreground mb-8">
          Discover the most sought-after watch models and their features
        </p>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search for a model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="featured">Featured Models</TabsTrigger>
            <TabsTrigger value="other">Other Models</TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            {isLoadingModels ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            ) : featuredModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-24 h-24 mb-6 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No models found</h3>
                <p className="text-muted-foreground max-w-sm">
                  {searchQuery 
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "There are no featured models available at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredModels.map((model) => {
                  const brand = brands.find(b => b.id === model.brand_id)
                  return (
                    <Link href={`/listings?brand=${brand?.slug}&model=${model.slug}`} key={model.id}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-square">
                          <Image
                            src={`/images/brands/${brand?.slug}.png`}
                            alt={`${brand?.label} ${model.label}`}
                            fill
                            className="object-contain p-4"
                          />
                          <div className="absolute top-2 right-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      toggleNotification(model.slug)
                                    }}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                      notifications[model.slug] 
                                        ? "bg-red-500 hover:bg-red-600" 
                                        : "bg-background/80 hover:bg-background/90"
                                    }`}
                                  >
                                    <Bell className={`h-4 w-4 ${notifications[model.slug] ? "text-white" : "text-muted-foreground"}`} />
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
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-primary">{brand?.label}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{model.label}</h3>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="other">
            {isLoadingModels ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            ) : otherModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-24 h-24 mb-6 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No models found</h3>
                <p className="text-muted-foreground max-w-sm">
                  {searchQuery 
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "There are no other models available at the moment."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {otherModels.map((model) => {
                  const brand = brands.find(b => b.id === model.brand_id)
                  return (
                    <Link href={`/listings?brand=${brand?.slug}&model=${model.slug}`} key={model.id}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative aspect-square">
                          <Image
                            src={`/images/brands/${brand?.slug}.png`}
                            alt={`${brand?.label} ${model.label}`}
                            fill
                            className="object-contain p-4"
                          />
                          <div className="absolute top-2 right-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      toggleNotification(model.slug)
                                    }}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                                      notifications[model.slug] 
                                        ? "bg-red-500 hover:bg-red-600" 
                                        : "bg-background/80 hover:bg-background/90"
                                    }`}
                                  >
                                    <Bell className={`h-4 w-4 ${notifications[model.slug] ? "text-white" : "text-muted-foreground"}`} />
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
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-primary">{brand?.label}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">{model.label}</h3>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}