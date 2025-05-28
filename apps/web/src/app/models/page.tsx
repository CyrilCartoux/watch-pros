"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import modelsData from "@/data/models.json"

export default function ModelsPage() {
  const [activeTab, setActiveTab] = useState("featured")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})

  const toggleNotification = (modelSlug: string) => {
    setNotifications(prev => ({
      ...prev,
      [modelSlug]: !prev[modelSlug]
    }))
  }

  const filterAndSortModels = (models: typeof modelsData.featured) => {
    return models
      .filter(model => 
        model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        model.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, ""))
        }
        if (sortBy === "price-desc") {
          return parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, ""))
        }
        // Default to popularity (featured models first)
        return 0
      })
  }

  const filteredFeaturedModels = filterAndSortModels(modelsData.featured)
  const filteredOtherModels = filterAndSortModels(modelsData.other)

  return (
    <main className="min-h-screen bg-background">
      <div className="container py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Modèles populaires</h1>
        <p className="text-muted-foreground mb-8">
          Découvrez les modèles de montres les plus recherchés et leurs caractéristiques
        </p>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Rechercher un modèle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularité</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="featured">Modèles phares</TabsTrigger>
            <TabsTrigger value="other">Autres modèles</TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFeaturedModels.map((model, index) => (
                <Link href={`/models/${model.slug}`} key={index}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square">
                      <Image
                        src={model.image}
                        alt={`${model.brand} ${model.name}`}
                        fill
                        className="object-cover"
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
                                ? "Désactiver les notifications" 
                                : "Activer les notifications"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-primary">{model.brand}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{model.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {model.description}
                      </p>
                      <p className="font-medium text-primary">{model.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="other">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredOtherModels.map((model, index) => (
                <Link href={`/models/${model.slug}`} key={index}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-square">
                      <Image
                        src={model.image}
                        alt={`${model.brand} ${model.name}`}
                        fill
                        className="object-cover"
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
                                ? "Désactiver les notifications" 
                                : "Activer les notifications"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-primary">{model.brand}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{model.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {model.description}
                      </p>
                      <p className="font-medium text-primary">{model.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
} 