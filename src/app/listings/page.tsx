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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  total: number;      // total global (tous les listings)
  fullCount: number; // total filtré (après recherche/filtres)
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  query: string;
  condition: string;
  dialColor: string;
  included: string;
  minPrice: string;
  maxPrice: string;
  shippingDelay: string;
  listingType: string;
  country: string;
}

const quickFilterCategories = {
  condition: [
    { label: "New", value: "new" },
    { label: "Very Good", value: "very-good" },
    { label: "Fair Condition", value: "fair" }
  ],
  included: [ 
    {
    label: "Full Set",
    value:'full-set'
  },
  {
    label: "Original papers", 
    value: 'papers-only'
  }],
  brands: [
    { label: "Rolex", value: "Rolex" },
    { label: "Audemars Piguet", value: "Audemars Piguet" },
    { label: "Patek Philippe", value: "Patek Philippe" },
    { label: "Omega", value: "Omega" },
    { label: "Cartier", value: "Cartier"}
  ],
  shippingDelay: [
    {
      label: '1-2 days',
      value: '1-2'
    },
    {
      label: '2-3 days',
      value: '2-3'
    },
    {
      label: '3-5 days',
      value: '3-5'
    },
  ]
}

function QuickFilters({
  filters,
  onFilterChange,
}: {
  filters: Filters
  onFilterChange: (newFilters: Filters) => void
}) {
  const handleFilterClick = (
    type: "condition" | "included" | "brands" | "shippingDelay",
    value: string
  ) => {
    const newFilters = { ...filters }

    if (type === "brands") {
      newFilters.query = filters.query === value ? "" : value
    } else if (type === "condition") {
      newFilters.condition = filters.condition === value ? "" : value
    } else if (type === "included") {
      newFilters.included = filters.included === value ? "" : value
    } else if (type === "shippingDelay") {
      newFilters.shippingDelay = filters.shippingDelay === value ? "" : value
    }
    onFilterChange(newFilters)
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex items-center gap-2 whitespace-nowrap">
        {quickFilterCategories.condition.map((item) => (
          <Button
            key={item.value}
            variant={filters.condition === item.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick("condition", item.value)}
          >
            {item.label}
          </Button>
        ))}
        <div className="border-l h-5 mx-2"></div>
        {quickFilterCategories.included.map((item) => (
          <Button
            key={item.value}
            variant={filters.included === item.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick("included", item.value)}
          >
            {item.label}
          </Button>
        ))}
        <div className="border-l h-5 mx-2"></div>
        {quickFilterCategories.brands.map((item) => (
          <Button
            key={item.value}
            variant={filters.query === item.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick("brands", item.value)}
          >
            {item.label}
          </Button>
        ))}
        <div className="border-l h-5 mx-2"></div>
        {quickFilterCategories.shippingDelay.map((item) => (
          <Button
            key={item.value}
            variant={filters.shippingDelay === item.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick("shippingDelay", item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

    </div>
  )
}

export default function ListingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  
  
  // Initialize filters from URL params
  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    return {
      query:        params.get("query")        || "",
      condition:    params.get("condition")    || "",
      dialColor:    params.get("dialColor")    || "",
      included:     params.get("included")     || "",
      minPrice:     params.get("minPrice")     || "",
      maxPrice:     params.get("maxPrice")     || "",
      shippingDelay:params.get("shippingDelay")|| "",
      listingType:  params.get("listingType")  || "",
      country:      params.get("country")      || "",
    }
  }, [searchParams])

  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [listings, setListings] = useState<Listing[]>([])
  const [totalItems, setTotalItems] = useState(0) // total global
  const [fullCount, setFullCount] = useState(0)   // total filtré
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 12

  const updateURL = useCallback((f = filters, pg = currentPage) => {
    const params = new URLSearchParams()
    
    // 1) barre de recherche
    if (f.query) params.set("query", f.query)

    // 2) les autres filtres
    if (f.condition)     params.set("condition",     f.condition)
    if (f.dialColor)     params.set("dialColor",     f.dialColor)
    if (f.included)      params.set("included",      f.included)
    if (f.minPrice)      params.set("minPrice",      f.minPrice)
    if (f.maxPrice)      params.set("maxPrice",      f.maxPrice)
    if (f.shippingDelay) params.set("shippingDelay", f.shippingDelay)
    if (f.listingType)   params.set("listingType",   f.listingType)
    if (f.country)       params.set("country",       f.country)

    // pagination : on met toujours la page dans l'URL
    if (pg > 0) params.set("page", pg.toString())

    // validation puis push
    const { errors } = validateURLParams(params)
    if (errors) {
      setError(errors.join(", "))
      return
    }
    router.push(`/listings?${params.toString()}`, { scroll: false })
  }, [filters, currentPage, router])

  const handleApplyFilters = useCallback((modalFilters: Partial<Filters>) => {
    const newFilters = { ...filters, ...modalFilters }
    setFilters(newFilters)
    setCurrentPage(1)
    updateURL(newFilters, 1)
    setIsFiltersOpen(false)
  }, [filters, updateURL])

  const handleClearFilters = useCallback(() => {
    const empty: Filters = {
      query:        "",
      condition:    "",
      dialColor:    "",
      included:     "",
      minPrice:     "",
      maxPrice:     "",
      shippingDelay:"",
      country:      "",
      listingType: filters.listingType,
    }
    setFilters(empty)
    setCurrentPage(1)
    updateURL(empty, 1)
    setIsFiltersOpen(false)
  }, [updateURL, filters.listingType])

  const removeFilter = useCallback((key: keyof Filters) => {
    const newFilters = { ...filters, [key]: "" }
    setFilters(newFilters)
    updateURL(newFilters)
  }, [filters, updateURL])

  const fetchListings = async (currentFilters: Filters, page: number, signal: AbortSignal) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
      })

      // Add filters to params
      const apiFilters = {
        query: currentFilters.query,
        condition: currentFilters.condition,
        dialColor: currentFilters.dialColor,
        included: currentFilters.included,
        minPrice: currentFilters.minPrice,
        maxPrice: currentFilters.maxPrice,
        shippingDelay: currentFilters.shippingDelay,
        listingType: currentFilters.listingType,
        country: currentFilters.country,
      }

      Object.entries(apiFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value)
        }
      })

      const response = await fetch(`/api/listings?${params}`, {
        signal: signal
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch listings')
      }
      const data: ListingsResponse = await response.json()

      setListings(data.listings || [])
      setFullCount(data.fullCount || 0)
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
  }

  // Initialize filters from URL on mount and when URL changes
  useEffect(() => {
    const controller = new AbortController()
    const initializeFromURL = async () => {
      try {
        setError(null)
        const params = new URLSearchParams(searchParams.toString())
        const { validParams, errors } = validateURLParams(params)
        
        if (errors) {
          setError(errors.join(", "))
          return
        }

        const page = Number(params.get("page")) || 1
        setCurrentPage(page)

        // Update filters state from the memoized initialFilters
        const newFilters = {
          query:        params.get("query")        || "",
          condition:    params.get("condition")    || "",
          dialColor:    params.get("dialColor")    || "",
          included:     params.get("included")     || "",
          minPrice:     params.get("minPrice")     || "",
          maxPrice:     params.get("maxPrice")     || "",
          shippingDelay:params.get("shippingDelay")|| "",
          listingType:  params.get("listingType")  || "",
          country:      params.get("country")      || "",
        }
        setFilters(newFilters)
        
        // Fetch listings with the new filters
        await fetchListings(newFilters, page, controller.signal)
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : "Failed to initialize filters")
      }
    }

    initializeFromURL()
    return () => controller.abort()
  }, [searchParams]) // Only depend on searchParams

  const handleSearchBar = (query: string) => {
    const newFilters = { ...filters, query }
    setFilters(newFilters)
    setCurrentPage(1)
    updateURL(newFilters, 1)
  }

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
          <p className="text-center text-muted-foreground mb-4">The #1 B2B Marketplace for Professional Watch Dealers</p>
          <SearchBar className="w-full h-12 text-lg" onSearch={handleSearchBar} />
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-base sm:text-lg font-bold">
            {fullCount.toLocaleString()} listing{fullCount > 1 ? "s" : ""}
            {typeof totalItems === "number" && totalItems > 0 && fullCount !== totalItems && (
              <span className="text-xs text-muted-foreground ml-2">
                (sur {totalItems.toLocaleString()} au total)
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 flex-shrink-0"
            onClick={() => setIsFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <div className="flex-1 min-w-0">
            <QuickFilters
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters)
                setCurrentPage(1)
                updateURL(newFilters, 1)
              }}
            />
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {(
            Object.keys(filters) as (keyof Filters)[]
          ).map((key) => {
            const value = filters[key]
            if (!value) return null

            // Définir le label pour chaque filtre
            const getFilterLabel = (k: keyof Filters): string => {
              switch (k) {
                case "query": return "Search"
                case "condition": return "Condition"
                case "dialColor": return "Dial color"
                case "included": return "Included"
                case "minPrice": return "Min price"
                case "maxPrice": return "Max price"
                case "shippingDelay": return "Shipping delay"
                case "listingType": return "Type"
                case "country": return "Country"
                default: return String(k).charAt(0).toUpperCase() + String(k).slice(1)
              }
            }

            // Optionnel: formater la valeur pour certains filtres
            const getFilterValue = (k: keyof Filters, v: string): string => {
              if (k === "condition") {
                return v === "new" ? "New" : v === "preowned" ? "Pre-owned" : v
              }
              if (k === "listingType") {
                return v === "watch" ? "Watch" : v === "accessory" ? "Accessory" : v
              }
              if (k === "country") {
                // Optionnel: afficher le label du pays si tu veux
                // return countries.find(c => c.value === v)?.label || v
                return v
              }
              return v
            }

            return (
              <div
                key={key}
                className="inline-flex items-center gap-2 pl-3 pr-2 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
              >
                <span className="font-medium">{getFilterLabel(key)}:</span>
                <span>{getFilterValue(key, value)}</span>
                <button
                  onClick={() => removeFilter(key)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
          {Object.values(filters).some(v => v !== "") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-sm"
            >
              Clear all
            </Button>
          )}
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
                {Object.values(filters).some(Boolean) 
                  ? "Try adjusting your filters or search terms to find what you're looking for."
                  : "There are no listings available at the moment. Please check back later."}
              </p>
              {Object.values(filters).some(Boolean) && (
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
            <div className="w-full">
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="flex items-center justify-center flex-wrap gap-2">
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
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}