"use client"

import Image from "next/image"
import Link from "next/link"

const brands = [
  {
    name: "Rolex",
    logo: "/images/brands/rolex.png",
    href: "/brands/rolex"
  },
  {
    name: "Patek Philippe",
    logo: "/images/brands/patek.png",
    href: "/brands/patek-philippe"
  },
  {
    name: "Audemars Piguet",
    logo: "/images/brands/ap.png",
    href: "/brands/audemars-piguet"
  },
  {
    name: "Omega",
    logo: "/images/brands/omega.png",
    href: "/brands/omega"
  },
  {
    name: "Cartier",
    logo: "/images/brands/cartier.png",
    href: "/brands/cartier"
  },
  {
    name: "Jaeger-LeCoultre",
    logo: "/images/brands/jlc.png",
    href: "/brands/jaeger-lecoultre"
  }
]

export function FeaturedBrands() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            Featured Brands
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive collection of luxury watch brands, from iconic manufacturers to independent watchmakers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              className="group flex flex-col items-center justify-center p-6 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl border border-border transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain filter grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
              {/* <span className="text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {brand.name}
              </span> */}
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/brands"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View All Brands
          </Link>
        </div>
      </div>
    </section>
  )
} 