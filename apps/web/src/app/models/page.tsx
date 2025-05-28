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

const featuredModels = [
  {
    brand: "Rolex",
    name: "Datejust",
    description: "La montre par excellence, symbole d'élégance intemporelle",
    image: "/images/watches/rolex-datejust.jpg",
    price: "À partir de 8 500 €",
    slug: "rolex-datejust"
  },
  {
    brand: "Rolex",
    name: "Submariner",
    description: "L'icône des montres de plongée, robuste et élégante",
    image: "/images/watches/rolex-submariner.jpg",
    price: "À partir de 9 500 €",
    slug: "rolex-submariner"
  },
  {
    brand: "Rolex",
    name: "Daytona",
    description: "La chronographe légendaire des courses automobiles",
    image: "/images/watches/rolex-daytona.jpg",
    price: "À partir de 14 500 €",
    slug: "rolex-daytona"
  },
  {
    brand: "Omega",
    name: "Speedmaster",
    description: "La Moonwatch, la première montre portée sur la Lune",
    image: "/images/watches/omega-speedmaster.jpg",
    price: "À partir de 6 500 €",
    slug: "omega-speedmaster"
  },
  {
    brand: "Audemars Piguet",
    name: "Royal Oak",
    description: "L'icône du design horloger moderne",
    image: "/images/watches/ap-royal-oak.jpg",
    price: "À partir de 25 000 €",
    slug: "audemars-piguet-royal-oak"
  },
  {
    brand: "Rolex",
    name: "Day-Date",
    description: "La montre des présidents, symbole de prestige",
    image: "/images/watches/rolex-day-date.jpg",
    price: "À partir de 35 000 €",
    slug: "rolex-day-date"
  },
  {
    brand: "Rolex",
    name: "GMT-Master II",
    description: "La montre des voyageurs, affichage de deux fuseaux horaires",
    image: "/images/watches/rolex-gmt-master.jpg",
    price: "À partir de 10 500 €",
    slug: "rolex-gmt-master-ii"
  },
  {
    brand: "Patek Philippe",
    name: "Nautilus",
    description: "L'icône du luxe sportif, design intemporel",
    image: "/images/watches/patek-nautilus.jpg",
    price: "À partir de 35 000 €",
    slug: "patek-philippe-nautilus"
  }
]

const otherModels = [
  {
    brand: "Omega",
    name: "Seamaster",
    description: "La montre de plongée emblématique",
    image: "/images/models/omega-seamaster.jpg",
    price: "À partir de 5 500 €",
    slug: "omega-seamaster"
  },
  {
    brand: "Breitling",
    name: "Navitimer",
    description: "La montre des pilotes, chronographe légendaire",
    image: "/images/models/breitling-navitimer.jpg",
    price: "À partir de 7 500 €",
    slug: "breitling-navitimer"
  },
  {
    brand: "Rolex",
    name: "Oyster Perpetual",
    description: "L'essence même de Rolex, élégance simple",
    image: "/images/models/rolex-oyster-perpetual.jpg",
    price: "À partir de 6 500 €",
    slug: "rolex-oyster-perpetual"
  },
  {
    brand: "Patek Philippe",
    name: "Grand Complications",
    description: "Le summum de la complexité horlogère",
    image: "/images/models/patek-grand-complications.jpg",
    price: "À partir de 100 000 €",
    slug: "patek-philippe-grand-complications"
  },
  {
    brand: "Audemars Piguet",
    name: "Royal Oak Offshore",
    description: "La version sportive de l'icône",
    image: "/images/models/ap-royal-oak-offshore.jpg",
    price: "À partir de 30 000 €",
    slug: "audemars-piguet-royal-oak-offshore"
  },
  {
    brand: "TAG Heuer",
    name: "Carrera",
    description: "La chronographe sportive légendaire",
    image: "/images/models/tag-heuer-carrera.jpg",
    price: "À partir de 4 500 €",
    slug: "tag-heuer-carrera"
  },
  {
    brand: "Panerai",
    name: "Luminor",
    description: "L'icône italienne de la plongée",
    image: "/images/models/panerai-luminor.jpg",
    price: "À partir de 7 500 €",
    slug: "panerai-luminor"
  },
  {
    brand: "Tudor",
    name: "Black Bay",
    description: "L'héritage de Rolex à un prix accessible",
    image: "/images/models/tudor-black-bay.jpg",
    price: "À partir de 3 500 €",
    slug: "tudor-black-bay"
  },
  {
    brand: "Rolex",
    name: "Yacht-Master",
    description: "La montre des amateurs de voile",
    image: "/images/models/rolex-yacht-master.jpg",
    price: "À partir de 12 500 €",
    slug: "rolex-yacht-master"
  },
  {
    brand: "Patek Philippe",
    name: "Calatrava",
    description: "L'élégance pure et simple",
    image: "/images/models/patek-calatrava.jpg",
    price: "À partir de 25 000 €",
    slug: "patek-philippe-calatrava"
  },
  {
    brand: "Hublot",
    name: "Big Bang",
    description: "L'innovation et le design audacieux",
    image: "/images/models/hublot-big-bang.jpg",
    price: "À partir de 15 000 €",
    slug: "hublot-big-bang"
  },
  {
    brand: "IWC",
    name: "Portuguese",
    description: "L'élégance portugaise",
    image: "/images/models/iwc-portuguese.jpg",
    price: "À partir de 8 500 €",
    slug: "iwc-portuguese"
  },
  {
    brand: "Rolex",
    name: "Explorer II",
    description: "La montre des explorateurs",
    image: "/images/models/rolex-explorer-ii.jpg",
    price: "À partir de 9 500 €",
    slug: "rolex-explorer-ii"
  },
  {
    brand: "IWC",
    name: "Pilot",
    description: "La montre des aviateurs",
    image: "/images/models/iwc-pilot.jpg",
    price: "À partir de 5 500 €",
    slug: "iwc-pilot"
  },
  {
    brand: "Zenith",
    name: "El Primero",
    description: "Le chronographe haute fréquence",
    image: "/images/models/zenith-el-primero.jpg",
    price: "À partir de 7 500 €",
    slug: "zenith-el-primero"
  }
]

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

  const filterAndSortModels = (models: typeof featuredModels) => {
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

  const filteredFeaturedModels = filterAndSortModels(featuredModels)
  const filteredOtherModels = filterAndSortModels(otherModels)

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