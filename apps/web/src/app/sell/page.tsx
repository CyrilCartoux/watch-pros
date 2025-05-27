"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Watch, Gift } from "lucide-react"
import Link from "next/link"

export default function SellPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-6 md:pb-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
              Mettre en vente
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4 md:px-0">
              Choisissez le type de produit que vous souhaitez vendre sur Watch Pros
            </p>
          </div>
        </div>
      </section>

      {/* Selection Cards */}
      <section className="py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Watch Card */}
            <Link href="/sell/watch" className="block">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Watch className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Montre</h2>
                    <p className="text-muted-foreground mb-6">
                      Mettez en vente votre montre de luxe. Notre plateforme vous permet de toucher une large communauté de passionnés et de professionnels.
                    </p>
                    <Button size="lg" className="w-full">
                      Vendre une montre
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Accessory Card */}
            <Link href="/sell/accessory" className="block">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Gift className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Accessoire</h2>
                    <p className="text-muted-foreground mb-6">
                      Vendez vos accessoires horlogers : bracelets, boîtes, outils, etc. Une opportunité de toucher une clientèle ciblée.
                    </p>
                    <Button size="lg" variant="outline" className="w-full">
                      Vendre un accessoire
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Pourquoi vendre sur Watch Pros ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Communauté ciblée</h3>
                <p className="text-muted-foreground text-sm">
                  Accédez à une communauté de passionnés et de professionnels du monde de l'horlogerie.
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Processus sécurisé</h3>
                <p className="text-muted-foreground text-sm">
                  Bénéficiez d'un système de paiement sécurisé et d'une protection contre les fraudes.
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Support dédié</h3>
                <p className="text-muted-foreground text-sm">
                  Notre équipe est là pour vous accompagner tout au long du processus de vente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 