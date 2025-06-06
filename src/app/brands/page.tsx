"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import brandsData from "@/data/brands.json"
import { useAuthGuard } from "@/hooks/useAuthGuard"

interface Brand {
  name: string
  slug: string
  description: string
  logo: string
}

export default function BrandsPage() {
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
  // Convert object to array and sort by name
  const brands = Object.values(brandsData) as Brand[]
  const sortedBrands = brands.sort((a, b) => a.name.localeCompare(b.name))

  // Group brands by first letter
  const groupedBrands = sortedBrands.reduce((acc, brand) => {
    const firstLetter = brand.name[0]
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(brand)
    return acc
  }, {} as Record<string, Brand[]>)

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 md:mb-6">
            The Most Prestigious Watch Brands
          </h1>
          <p className="text-base md:text-xl text-muted-foreground text-center max-w-3xl mx-auto px-4">
            Discover our selection of the most prestigious watch brands in the world.
            From Rolex to Patek Philippe, explore the excellence of horology.
          </p>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Featured Brands</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {['rolex', 'audemars-piguet', 'patek-philippe', 'omega'].map((slug) => {
              const brand = brandsData[slug as keyof typeof brandsData]
              return (
                <Link href={`/brands/${brand.slug}`} key={brand.slug}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                        <Image
                          src={brand.logo}
                          alt={brand.name}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Alphabetical List */}
      <section className="py-8 md:py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">All Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(groupedBrands).map(([letter, brands]) => (
              <div key={letter} className="space-y-3 md:space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-primary">{letter}</h3>
                <div className="space-y-1 md:space-y-2">
                  {brands.map((brand) => (
                    <Link
                      href={`/brands/${brand.slug}`}
                      key={brand.slug}
                      className="block p-2 md:p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-primary/20 flex items-center justify-center">
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={40}
                            height={40}
                            className="object-contain w-full h-full p-1"
                          />
                        </div>
                        <span className="text-sm md:text-base font-medium">{brand.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Introduction Card */}
            <Card className="mb-12">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">The Greatest Watch Brands in the World</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Looking to buy a luxury watch? On Watch Pros, you have a wide selection of manufacturers, 
                  brands, and models. Several factors come into play when buying a watch: design, 
                  history, and finishing quality are criteria just as important as mechanism complexity, 
                  price, value retention, or model prestige.
                </p>
              </CardContent>
            </Card>

            {/* Popular Brands Section */}
            <div className="space-y-12">
              {/* Top Brands */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold">The Most Prestigious Brands</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Rolex */}
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h4 className="text-xl font-semibold mb-3">Rolex</h4>
                        <p className="text-muted-foreground">
                          The market leader, considered a symbol of social status. Watches from this Geneva manufacturer 
                          are known to everyone, even those without deep knowledge of horology.
                        </p>
                      </div>
                      {/* Patek Philippe */}
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h4 className="text-xl font-semibold mb-3">Patek Philippe</h4>
                        <p className="text-muted-foreground">
                          Embodies watchmaking tradition and art for over 180 years. The timepieces attract with their 
                          impeccable finishing and sophisticated manufacture calibers.
                        </p>
                      </div>
                      {/* Richard Mille */}
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h4 className="text-xl font-semibold mb-3">Richard Mille</h4>
                        <p className="text-muted-foreground">
                          A young but prestigious manufacturer, known for its original materials and high-tech calibers. 
                          Popular among many celebrities like Rafael Nadal and Jay-Z.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Men's Watches */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold">Men's Watches</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Breitling */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Breitling</h4>
                      <p className="text-muted-foreground">
                        Traditional Swiss manufacturer based in Grenchen. Known for its pilot watches like the Chronomat 
                        or Navitimer.
                      </p>
                    </div>
                    {/* Panerai */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Panerai</h4>
                      <p className="text-muted-foreground">
                        Large Italian watches, formerly reserved for the Italian navy. Made famous by 
                        Hollywood stars like Sylvester Stallone.
                      </p>
                    </div>
                    {/* Hublot */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Hublot</h4>
                      <p className="text-muted-foreground">
                        Modern watches with masculine design. Official timekeeper for major FIFA and UEFA events.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Women's Watches */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold">Women's Watches</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cartier */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Cartier</h4>
                      <p className="text-muted-foreground">
                        French luxury watch and jewelry manufacturer. Classic models like the Tank, Panthère, or 
                        Ballon Bleu are highly sought after by celebrities.
                      </p>
                    </div>
                    {/* Chopard */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Chopard</h4>
                      <p className="text-muted-foreground">
                        Swiss creator known for its Happy Diamonds editions with mobile diamonds that dance 
                        freely on the dial.
                      </p>
                    </div>
                    {/* Bulgari */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Bulgari</h4>
                      <p className="text-muted-foreground">
                        Combines Italian design with Swiss watchmaking art. Highly coveted Bvlgari Bvlgari and Serpenti collections.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Country Sections Grid */}
            <div className="mt-16 space-y-12">
              <h2 className="text-3xl font-bold text-center mb-12">The Great Watchmaking Nations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Swiss Brands */}
                <Card className="bg-muted/5">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Swiss Brands</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Switzerland is the birthplace of luxury watchmaking. With a unique concentration of prestigious manufacturers, 
                        it dominates the global high-end watch market.
                      </p>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Key Strengths</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Centuries-old watchmaking tradition</li>
                          <li>• Technical and artisanal excellence</li>
                          <li>• Constant innovation</li>
                          <li>• Concentration of prestigious manufacturers</li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Key Regions</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Vallée de Joux</li>
                          <li>• Geneva</li>
                          <li>• La Chaux-de-Fonds</li>
                          <li>• Bienne</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* German Brands */}
                <Card className="bg-muted/5">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">German Brands</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Germany has a rich watchmaking tradition, with particular emphasis on precision 
                        and high-quality mechanical engineering.
                      </p>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Key Strengths</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Legendary German precision</li>
                          <li>• Minimalist and functional design</li>
                          <li>• Technical innovation</li>
                          <li>• Exceptional quality</li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Key Regions</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Glashütte</li>
                          <li>• Pforzheim</li>
                          <li>• Black Forest</li>
                          <li>• Munich</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Japanese Brands */}
                <Card className="bg-muted/5">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">Japanese Brands</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Japan revolutionized watchmaking with the introduction of quartz and continues to innovate 
                        with cutting-edge technology and exceptional precision.
                      </p>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Key Strengths</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Technological innovation</li>
                          <li>• Extreme precision</li>
                          <li>• Exceptional value for money</li>
                          <li>• Modern design</li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Key Regions</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Tokyo</li>
                          <li>• Nagoya</li>
                          <li>• Shiojiri</li>
                          <li>• Suwa</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 