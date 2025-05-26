"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import brandsData from "@/data/brands.json"

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

  if (!brandInfo) {
    return <div>Marque non trouvée</div>
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[300px] md:min-h-[420px] flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 py-8 md:py-16">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-primary shadow-lg bg-white flex items-center justify-center p-4">
            <Image
              src={brandInfo.logo}
              alt={`${brandInfo.name} logo`}
              width={180}
              height={180}
              className="object-contain object-center"
              priority
            />
          </div>
          <h1 className="mt-6 md:mt-8 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground text-center">
            {brandInfo.name}
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-muted-foreground text-center max-w-2xl px-4">
            {brandInfo.description}
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/40 pointer-events-none" />
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-16">
        <div className="container">
          <Tabs defaultValue="models" className="space-y-6 md:space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="models">Modèles Phares</TabsTrigger>
              <TabsTrigger value="listings">Listings</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-6 md:space-y-8">
              {/* Key Features */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {brandInfo.keyFeatures.map((feature, index) => (
                  <Card key={index} className="bg-card hover:shadow-md transition-shadow">
                    <CardContent className="p-3 md:p-6">
                      <div className="flex flex-col items-center text-center gap-2 md:flex-row md:items-start md:text-left md:gap-3">
                        <div className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm md:text-base text-foreground line-clamp-3">{feature}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Featured Models */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
            </TabsContent>

            <TabsContent value="listings">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Placeholder for listings */}
                <Card className="bg-card">
                  <CardContent className="p-4 md:p-6">
                    <p className="text-muted-foreground">
                      Les listings seront bientôt disponibles
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-foreground">À propos de {brandInfo.name}</h2>
          
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

            {/* Key Features */}
            <div className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-semibold text-foreground mb-4">Points forts</h3>
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
            <h3 className="text-2xl font-semibold text-foreground mb-4">Gamme de prix</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-foreground mb-2">Prix catalogue (2023)</h4>
                <p className="text-muted-foreground">{brandInfo.priceRange.catalog}</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">Marché secondaire</h4>
                <p className="text-muted-foreground">{brandInfo.priceRange.secondary}</p>
              </div>
            </div>
          </div>

          {/* Iconic Models */}
          <div className="mt-12 space-y-8">
            <h3 className="text-2xl font-semibold text-foreground">Modèles Emblématiques</h3>
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