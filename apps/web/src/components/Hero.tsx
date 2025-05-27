"use client"

import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/SearchBar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-12 md:pt-16 min-h-[500px] md:h-[600px] flex items-center justify-center">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-secondary/30" />
      </div>

      {/* Content */}
      <div className="relative container px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
          La plateforme B2B qui révolutionne le commerce des montres de luxe
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 px-4 md:px-0">
          Plus efficace que WhatsApp, plus accessible que Chrono24. Une solution professionnelle pour les vendeurs et acheteurs de montres de luxe.
        </p>
        <div className="max-w-4xl mx-auto space-y-4">
          <SearchBar />
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
            <Link href="/sell" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Vendre une montre
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                Créer un compte pro
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 