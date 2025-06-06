"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Bell, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuthGuard } from "@/hooks/useAuthGuard"

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
  brands: Brand
}

export default function ModelsPage() {
  const { isAuthorized, isLoading: isAuthLoading } = useAuthGuard({
    requireAuth: true,
    requireSeller: true,
    requireVerified: true
  })
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})
  const [brands, setBrands] = useState<Brand[]>([])
  const [allModels, setAllModels] = useState<Model[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubscribing, setIsSubscribing] = useState<Record<string, boolean>>({})

  // Fetch brands, models and subscriptions in parallel
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, modelsResponse, subscriptionsResponse] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/models/all"),
          fetch("/api/subscribe-model")
        ])

        if (!brandsResponse.ok) {
          throw new Error("Failed to fetch brands")
        }
        if (!modelsResponse.ok) {
          throw new Error("Failed to fetch models")
        }
        if (!subscriptionsResponse.ok) {
          throw new Error("Failed to fetch subscriptions")
        }

        const [brandsData, modelsData, subscriptionsData] = await Promise.all([
          brandsResponse.json(),
          modelsResponse.json(),
          subscriptionsResponse.json()
        ])

        setBrands(brandsData.brands)
        setAllModels(modelsData.models)
        
        // Initialize notifications state from subscriptions
        const initialNotifications = subscriptionsData.subscriptions.reduce((acc: Record<string, boolean>, sub: any) => {
          acc[sub.model.id] = true
          return acc
        }, {})
        setNotifications(initialNotifications)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const toggleNotification = async (model: Model) => {
    try {
      setIsSubscribing(prev => ({ ...prev, [model.id]: true }))
      
      const isSubscribing = !notifications[model.id]
      const method = isSubscribing ? 'POST' : 'DELETE'
      
      const response = await fetch('/api/subscribe-model', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model_id: model.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to toggle notification')
      }

    setNotifications(prev => ({
      ...prev,
        [model.id]: !prev[model.id]
      }))

      toast({
        title: isSubscribing ? "Notification enabled" : "Notification disabled",
        description: isSubscribing 
          ? `You will be notified about new listings for ${model.brands.label} ${model.label}`
          : `You will no longer receive notifications for ${model.brands.label} ${model.label}`,
      })
    } catch (err) {
      console.error('Error toggling notification:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update notification settings",
      })
    } finally {
      setIsSubscribing(prev => ({ ...prev, [model.id]: false }))
    }
  }

  const filterAndSortModels = (models: Model[]) => {
    return models.filter(model => 
      model.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.brands.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  // Définir l'ordre des marques populaires
  const popularBrandsOrder = ["rolex", "audemars-piguet", "patek-philippe"]
  
  const featuredModels = allModels
    .filter(model => model.brands.popular && model.popular)
    .sort((a, b) => {
      const aIndex = popularBrandsOrder.indexOf(a.brands.slug)
      const bIndex = popularBrandsOrder.indexOf(b.brands.slug)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })

  const otherModels = allModels
    .filter(model => !model.brands.popular || !model.popular)

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
            {isLoading ? (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {featuredModels.map((model) => (
                  <Link href={`/listings?brand=${model.brands.slug}&model=${model.slug}`} key={model.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={`/images/brands/${model.brands.slug}.png`}
                          alt={`${model.brands.label} ${model.label}`}
                          fill
                          className="object-contain p-1"
                        />
                        <div className="absolute top-1 right-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    toggleNotification(model)
                                  }}
                                  disabled={isSubscribing[model.id]}
                                  className={`p-1 rounded-full backdrop-blur-sm transition-colors ${
                                    notifications[model.id] 
                                      ? "bg-red-500 hover:bg-red-600" 
                                      : "bg-background/80 hover:bg-background/90"
                                  } ${isSubscribing[model.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                  {isSubscribing[model.id] ? (
                                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                  ) : (
                                    <Bell className={`h-3 w-3 ${notifications[model.id] ? "text-white" : "text-muted-foreground"}`} />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {notifications[model.id] 
                                  ? "Disable notifications" 
                                  : "Enable notifications"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <CardContent className="p-1.5">
                        <div className="flex items-center gap-0.5 mb-0.5">
                          <span className="text-[10px] font-medium text-primary">{model.brands.label}</span>
                        </div>
                        <h3 className="text-xs font-semibold line-clamp-1">{model.label}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="other">
            {isLoading ? (
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                {otherModels.map((model) => (
                  <Link href={`/listings?brand=${model.brands.slug}&model=${model.slug}`} key={model.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={`/images/brands/${model.brands.slug}.png`}
                          alt={`${model.brands.label} ${model.label}`}
                          fill
                          className="object-contain p-1"
                        />
                        <div className="absolute top-1 right-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    toggleNotification(model)
                                  }}
                                  disabled={isSubscribing[model.id]}
                                  className={`p-1 rounded-full backdrop-blur-sm transition-colors ${
                                    notifications[model.id] 
                                      ? "bg-red-500 hover:bg-red-600" 
                                      : "bg-background/80 hover:bg-background/90"
                                  } ${isSubscribing[model.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                  {isSubscribing[model.id] ? (
                                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                                  ) : (
                                    <Bell className={`h-3 w-3 ${notifications[model.id] ? "text-white" : "text-muted-foreground"}`} />
                                  )}
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {notifications[model.id] 
                                  ? "Disable notifications" 
                                  : "Enable notifications"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      <CardContent className="p-1.5">
                        <div className="flex items-center gap-0.5 mb-0.5">
                          <span className="text-[10px] font-medium text-primary">{model.brands.label}</span>
                        </div>
                        <h3 className="text-xs font-semibold line-clamp-1">{model.label}</h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}