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
import { useState } from "react"
import modelsData from "@/data/models.json"

export function FeaturedModels() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({})

  const toggleNotification = (modelSlug: string) => {
    setNotifications(prev => ({
      ...prev,
      [modelSlug]: !prev[modelSlug]
    }))
  }

  return (
    <section className="py-8 md:py-16 bg-background">
      <div className="container">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">Modèles Phares</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Découvrez les modèles de montres les plus recherchés et leurs caractéristiques
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {modelsData.featured.map((model, index) => (
            <Link href={`/models/${model.slug}`} key={index}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={model.image}
                    alt={`${model.brand} ${model.name}`}
                    fill
                    className="object-cover"
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
                            ? "Désactiver les notifications" 
                            : "Activer les notifications"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <CardContent className="p-2 md:p-4">
                  <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                    <span className="text-xs md:text-sm font-medium text-primary">{model.brand}</span>
                  </div>
                  <h3 className="text-sm md:text-lg font-semibold mb-1 md:mb-2 line-clamp-1">{model.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-2">
                    {model.description}
                  </p>
                  <p className="text-sm md:text-base font-medium text-primary">{model.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6 md:mt-8">
          <Link 
            href="/models" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 md:h-10 px-3 md:px-4 py-2"
          >
            Voir tous les modèles
          </Link>
        </div>
      </div>
    </section>
  )
} 