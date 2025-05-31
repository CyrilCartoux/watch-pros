"use client"

import { useState } from "react"
import { ListingFilters } from "@/components/ListingFilters"
import { ListingCard } from "@/components/ListingCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import listingsData from "@/data/listings2.json"

export default function ListingsPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const handleFilterChange = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  // Convert listings2.json data to format expected by ListingCard
  const listings = Object.entries(listingsData).map(([id, listing]) => ({
    id,
    brand: listing.brand,
    model: listing.model,
    reference: listing.reference,
    title: listing.title,
    description: listing.description,
    year: listing.year,
    condition: listing.condition,
    price: listing.price,
    currency: listing.currency,
    shippingDelay: listing.shippingDelay,
    images: listing.images
  }))

  const totalItems = listings.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {totalItems.toLocaleString()} listings
          </h1>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="price-asc">Price ascending</SelectItem>
              <SelectItem value="price-desc">Price descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ListingFilters
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  )
}