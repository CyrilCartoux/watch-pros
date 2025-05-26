"use client"

import { SearchBar } from "@/components/SearchBar"

export function Hero() {
  return (
    <section className="relative pt-16 h-[600px] flex items-center justify-center">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      >
        <div className="absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative container text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-foreground">
          The Premier B2B Luxury Watch Marketplace
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Connect with trusted dealers, source rare timepieces, and grow your luxury watch business with Watch Pros.
        </p>
        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </section>
  )
} 