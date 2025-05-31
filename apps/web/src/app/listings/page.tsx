"use client"

import { useState, useEffect } from "react"
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

interface Listing {
  id: string;
  brand: string;
  model: string;
  reference: string;
  title: string;
  description: string;
  year: string;
  condition: string;
  price: number;
  currency: string;
  shippingDelay: string;
  images: string[];
}

interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ListingsPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("relevance")
  const [listings, setListings] = useState<Listing[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 12

  const handleFilterChange = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortBy === "relevance" ? "created_at" : 
              sortBy === "price-asc" ? "price" :
              sortBy === "price-desc" ? "price" : "created_at",
        order: sortBy === "price-asc" ? "asc" : "desc"
      })

      // Add filters to params
      selectedFilters.forEach(filter => {
        const [key, value] = filter.split(':')
        params.append(key, value)
      })

      const response = await fetch(`/api/listings?${params}`)
      const data: ListingsResponse = await response.json()

      setListings(data.listings)
      setTotalItems(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [currentPage, sortBy, selectedFilters])

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {totalItems.toLocaleString()} listings
          </h1>
          <Select 
            value={sortBy} 
            onValueChange={setSortBy}
          >
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

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              disabled={isLoading}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  )
}