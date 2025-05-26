"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "./ui/card"

const listings = [
  {
    id: 1,
    title: "Rolex Submariner Date",
    reference: "126610LN",
    year: "2023",
    price: "12,500",
    condition: "New",
    image: "/images/watches/submariner.jpg",
    href: "/listings/O5FLZ2"
  },
  {
    id: 2,
    title: "Patek Philippe Nautilus",
    reference: "5711/1A",
    year: "2022",
    price: "95,000",
    condition: "Like New",
    image: "/images/watches/nautilus.jpg",
    href: "/listings/2"
  },
  {
    id: 3,
    title: "Audemars Piguet Royal Oak",
    reference: "15500ST",
    year: "2023",
    price: "45,000",
    condition: "New",
    image: "/images/watches/royal-oak.jpg",
    href: "/listings/3"
  },
  {
    id: 4,
    title: "Omega Speedmaster Professional",
    reference: "310.30.42.50.01.001",
    year: "2023",
    price: "6,500",
    condition: "New",
    image: "/images/watches/speedmaster.jpg",
    href: "/listings/4"
  }
]

export function FeaturedListings() {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            Featured Listings
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of exceptional timepieces from trusted dealers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <Link key={listing.id} href={listing.href}>
              <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                <div className="relative aspect-square">
                  <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1 text-foreground">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ref. {listing.reference} • {listing.year}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary">${listing.price}</span>
                    <span className="text-sm text-muted-foreground">
                      {listing.condition}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/listings"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View All Listings
          </Link>
        </div>
      </div>
    </section>
  )
} 