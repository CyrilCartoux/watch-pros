"use client"

import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/SearchBar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative pt-12 md:pt-16 min-h-[500px] md:h-[600px] flex items-center justify-center">
      {/* Content */}
      <div className="relative container px-4 md:px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
          The B2B platform revolutionizing luxury watch trading
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 px-4 md:px-0">
          More efficient than WhatsApp, more accessible than Chrono24. A professional solution for luxury watch buyers and sellers.
        </p>
        <div className="max-w-4xl mx-auto space-y-4">
          <SearchBar />
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
            <Link href="/sell" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Sell a watch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                Create a pro account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}