"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import brandsData from "@/data/brands.json"

interface Brand {
  name: string
  slug: string
  description: string
  logo: string
}

export default function BrandsPage() {
  // Convertir l'objet en tableau et trier par nom
  const brands = Object.values(brandsData) as Brand[]
  const sortedBrands = brands.sort((a, b) => a.name.localeCompare(b.name))

  // Grouper les marques par première lettre
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
            Les Plus Grandes Marques de Montres
          </h1>
          <p className="text-base md:text-xl text-muted-foreground text-center max-w-3xl mx-auto px-4">
            Découvrez notre sélection des plus prestigieuses marques horlogères du monde.
            De Rolex à Patek Philippe, explorez l'excellence de l'art horloger.
          </p>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Marques Phares</h2>
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
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Toutes les Marques</h2>
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
                <h2 className="text-3xl font-bold mb-6 text-center">Les Plus Grandes Marques de Montres au Monde</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Vous souhaitez acheter une montre de luxe ? Sur Watch Pros, vous disposez d'un vaste choix de fabricants, 
                  de marques et de modèles. Plusieurs facteurs entrent en jeu au moment de l'achat d'une montre : le design, 
                  l'histoire et la qualité des finitions sont des critères tout aussi importants que la complexité du mécanisme, 
                  le prix, la conservation de la valeur ou le prestige du modèle.
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
                    <h3 className="text-2xl font-bold">Les Marques les Plus Prestigieuses</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Rolex */}
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h4 className="text-xl font-semibold mb-3">Rolex</h4>
                        <p className="text-muted-foreground">
                          Le numéro un du marché, considéré comme un symbole de statut social. Les montres de cette manufacture genevoise 
                          sont connues de tous, même de ceux qui n'ont pas de connaissances approfondies en horlogerie.
                        </p>
                      </div>
                      {/* Patek Philippe */}
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h4 className="text-xl font-semibold mb-3">Patek Philippe</h4>
                        <p className="text-muted-foreground">
                          Incarne la tradition et l'art de l'horlogerie depuis plus de 180 ans. Les garde-temps séduisent par leur 
                          finition impeccable et leurs calibres de manufacture sophistiqués.
                        </p>
                      </div>
                      {/* Richard Mille */}
                      <div className="bg-muted/30 p-6 rounded-lg">
                        <h4 className="text-xl font-semibold mb-3">Richard Mille</h4>
                        <p className="text-muted-foreground">
                          Un fabricant jeune mais prestigieux, connu pour ses matériaux originaux et calibres high-tech. 
                          Apprécié par de nombreuses célébrités comme Rafael Nadal et Jay-Z.
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
                    <h3 className="text-2xl font-bold">Montres pour Hommes</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Breitling */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Breitling</h4>
                      <p className="text-muted-foreground">
                        Fabricant suisse riche en traditions, basé à Grenchen. Connu pour ses montres d'aviateur comme la Chronomat 
                        ou la Navitimer.
                      </p>
                    </div>
                    {/* Panerai */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Panerai</h4>
                      <p className="text-muted-foreground">
                        Montres italiennes de grande taille, anciennement réservées à la marine italienne. Rendu célèbre par 
                        des stars d'Hollywood comme Sylvester Stallone.
                      </p>
                    </div>
                    {/* Hublot */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Hublot</h4>
                      <p className="text-muted-foreground">
                        Montres modernes au design masculin. Chronométreur officiel des grands événements de la FIFA et de l'UEFA.
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
                    <h3 className="text-2xl font-bold">Montres pour Femmes</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Cartier */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Cartier</h4>
                      <p className="text-muted-foreground">
                        Fabricant français de montres et bijoux de luxe. Modèles classiques comme la Tank, la Panthère ou 
                        la Ballon Bleu, très prisés par les célébrités.
                      </p>
                    </div>
                    {/* Chopard */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Chopard</h4>
                      <p className="text-muted-foreground">
                        Créateur suisse connu pour ses éditions Happy Diamonds avec des diamants mobiles qui dansent 
                        librement sur le cadran.
                      </p>
                    </div>
                    {/* Bulgari */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h4 className="text-xl font-semibold mb-3">Bulgari</h4>
                      <p className="text-muted-foreground">
                        Allie le design italien à l'art horloger suisse. Collections Bvlgari Bvlgari et Serpenti très convoitées.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Country Sections Grid */}
            <div className="mt-16 space-y-12">
              <h2 className="text-3xl font-bold text-center mb-12">Les Grandes Nations Horlogères</h2>
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
                      <h3 className="text-2xl font-bold">Marques Suisses</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        La Suisse est le berceau de l'horlogerie de luxe. Avec une concentration unique de manufactures prestigieuses, 
                        elle domine le marché mondial des montres haut de gamme.
                      </p>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Points forts</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Tradition horlogère séculaire</li>
                          <li>• Excellence technique et artisanale</li>
                          <li>• Innovation constante</li>
                          <li>• Concentration de manufactures prestigieuses</li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Régions clés</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Vallée de Joux</li>
                          <li>• Genève</li>
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
                      <h3 className="text-2xl font-bold">Marques Allemandes</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        L'Allemagne possède une riche tradition horlogère, avec un accent particulier sur la précision 
                        et l'ingénierie mécanique de haute qualité.
                      </p>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Points forts</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Précision allemande légendaire</li>
                          <li>• Design minimaliste et fonctionnel</li>
                          <li>• Innovation technique</li>
                          <li>• Qualité exceptionnelle</li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Régions clés</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Glashütte</li>
                          <li>• Pforzheim</li>
                          <li>• Forêt-Noire</li>
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
                      <h3 className="text-2xl font-bold">Marques Japonaises</h3>
                    </div>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Le Japon a révolutionné l'horlogerie avec l'introduction du quartz et continue d'innover 
                        avec des technologies de pointe et une précision exceptionnelle.
                      </p>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Points forts</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          <li>• Innovation technologique</li>
                          <li>• Précision extrême</li>
                          <li>• Qualité-prix exceptionnelle</li>
                          <li>• Design moderne</li>
                        </ul>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Régions clés</h4>
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