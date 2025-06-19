"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { ListingCard } from "@/components/ListingCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useRouter, useSearchParams } from "next/navigation"
import { useFavorites } from "@/hooks/useFavorites"
import { SearchBar } from "@/components/SearchBar"
import { ModalFilters } from "@/components/ModalFilters"
import { validateURLParams } from "@/lib/helpers/url-validation"

interface ListingImage {
  id: string
  url: string
  order_index: number
}

interface Listing {
  id: string
  reference_id: string
  seller_id: string
  brand_id: string
  model_id: string
  reference: string
  title: string
  description: string | null
  year: string | null
  gender: string | null
  serial_number: string | null
  dial_color: string | null
  diameter_min: number | null
  diameter_max: number | null
  movement: string | null
  case_material: string | null
  bracelet_material: string | null
  bracelet_color: string | null
  included: string | null
  condition: string
  price: number
  currency: string
  shipping_delay: string
  status: string
  created_at: string
  updated_at: string
  listing_type: string
  brands: any | null
  models: {
    slug: string
    label: string
    popular: boolean
  } | null
  listing_images: ListingImage[]
  seller: {
    id: string
    company_name: string
    watch_pros_name: string
    company_logo_url: string | null
    crypto_friendly: boolean
  } | null
}

interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  search: string;
  brand: string;
  model: string;
  reference: string;
  seller: string;
  year: string;
  dialColor: string;
  condition: string;
  included: string;
  minPrice: string;
  maxPrice: string;
  shippingDelay: string;
  listingType: string;
  country: string;
}

export default function ListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  
  // Initialize filters from URL params
  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    return {
      search: params.get("search") || "",
      brand: params.get("brand") || "",
      model: params.get("model") || "",
      reference: params.get("reference") || "",
      seller: params.get("seller") || "",
      year: params.get("year") || "",
      dialColor: params.get("dialColor") || "",
      condition: params.get("condition") || "",
      included: params.get("included") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      shippingDelay: params.get("shippingDelay") || "",
      listingType: params.get("listingType") || "",
      country: params.get("country") || "",
    }
  }, [searchParams])

  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [tempFilters, setTempFilters] = useState<Filters>(filters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "")
  const [listings, setListings] = useState<Listing[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 12


  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setTempFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateURL = useCallback((f = filters, pg = currentPage, sort = sortBy) => {
    const params = new URLSearchParams()
    
    // Add non-empty filters to URL
    Object.entries(f).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    // Add pagination and sorting
    if (pg > 1) params.set("page", pg.toString())
    if (sort !== "relevance") params.set("sort", sort)

    // Validate parameters before updating URL
    const { validParams, errors } = validateURLParams(params)
    if (errors) {
      setError(errors.join(", "))
      return
    }

    // Update URL without reloading the page
    router.push(`/listings?${params.toString()}`, { scroll: false })
  }, [filters, currentPage, sortBy, router])

  const handleApplyFilters = useCallback(() => {
    setFilters(tempFilters)
    setCurrentPage(1)
    updateURL(tempFilters, 1)
    setIsFiltersOpen(false)
  }, [tempFilters, updateURL])

  const handleClearFilters = useCallback(() => {
    const emptyFilters = {
      search: "",
      brand: "",
      model: "",
      reference: "",
      seller: "",
      year: "",
      dialColor: "",
      condition: "",
      included: "",
      minPrice: "",
      maxPrice: "",
      shippingDelay: "",
      listingType: "",
      country: "",
    }
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
    setCurrentPage(1)
    updateURL(emptyFilters, 1)
    setIsFiltersOpen(false)
  }, [updateURL])


  const removeFilter = useCallback((key: keyof Filters) => {
    const newFilters = { ...filters, [key]: "" }
    setTempFilters(newFilters)
    setFilters(newFilters)
    updateURL(newFilters)
  }, [filters, updateURL])

  const fetchListings = async () => {
    const controller = new AbortController()
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sort: sortBy === "relevance" ? "created_at" : 
              sortBy === "price-asc" ? "price" :
              sortBy === "price-desc" ? "price" : "created_at",
        order: sortBy === "price-asc" ? "asc" : "desc"
      })

      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/listings?${params}`, {
        signal: controller.signal
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch listings')
      }
      const data: ListingsResponse = await response.json()

      setListings(data.listings || [])
      setTotalItems(data.total || 0)
      setTotalPages(data.totalPages || 0)
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      console.error('Error fetching listings:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch listings')
      setListings([])
      setTotalItems(0)
      setTotalPages(0)
    } finally {
      setIsLoading(false)
    }
    return () => controller.abort()
  }

  // Initialize filters from URL on mount and when URL changes
  useEffect(() => {
    const initializeFromURL = async () => {
      try {
        setError(null)
        const params = new URLSearchParams(searchParams.toString())
        const { validParams, errors } = validateURLParams(params)
        
        if (errors) {
          setError(errors.join(", "))
          return
        }

        // Update filters from URL
        setFilters(initialFilters)
        setTempFilters(initialFilters)
        
        // Fetch listings with the new filters
        await fetchListings()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize filters")
      }
    }

    initializeFromURL()
  }, [searchParams]) // Only depend on searchParams

  // Update URL when page changes
  useEffect(() => {
    if (currentPage > 1) {
      updateURL()
      // Scroll to top smoothly when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage, updateURL])

  // Update URL when sort changes
  useEffect(() => {
    if (sortBy !== "relevance") {
      updateURL()
      // Scroll to top smoothly when sort changes
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [sortBy, updateURL])

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Search Bar Section */}
      <div className="mb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-2">Professional Timepiece Collection</h1>
          <SearchBar className="w-full h-12 text-lg" />
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-base sm:text-lg font-bold">
            {totalItems.toLocaleString()} listings
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="flex items-center justify-center gap-2 font-medium text-base px-6 h-12 bg-primary hover:bg-primary/90 w-full sm:w-auto"
              onClick={() => setIsFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-6 w-6" />
              Filters
            </Button>
            <Select
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price ascending</SelectItem>
                <SelectItem value="price-desc">Price descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null
            return (
              <div
                key={key}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
              >
                <span>{value}</span>
                <button
                  onClick={() => removeFilter(key as keyof Filters)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Listings Grid */}
        <div className="lg:col-span-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 md:gap-4">
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
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-24 h-24 mb-6 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No listings found</h3>
              <p className="text-muted-foreground max-w-sm">
                {Object.values(tempFilters).some(Boolean) 
                  ? "Try adjusting your filters or search terms to find what you're looking for."
                  : "There are no listings available at the moment. Please check back later."}
              </p>
              {Object.values(tempFilters).some(Boolean) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleClearFilters}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isFavorite={isFavorite(listing.id)}
                  onFavoriteClick={() => {
                    if (isFavorite(listing.id)) {
                      removeFavorite(listing.id)
                    } else {
                      addFavorite(listing.id)
                    }
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && listings.length > 0 && (
            <div className="w-full overflow-x-auto">
              <div className="flex flex-col items-center gap-4 mt-8 min-w-max">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </Button>
                      {currentPage > 4 && <span className="px-2">...</span>}
                    </>
                  )}

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>

                {/* Page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Go to page:</span>
                  <Select
                    value={currentPage.toString()}
                    onValueChange={(value) => setCurrentPage(Number(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Page" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <SelectItem key={page} value={page.toString()}>
                          {page}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    of {totalPages}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal */}
      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ModalFilters
            tempFilters={tempFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}