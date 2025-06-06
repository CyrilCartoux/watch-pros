"use client"

import { useState, useEffect } from "react"
import { ListingCard } from "@/components/ListingCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { watchConditions } from "@/data/watch-conditions"
import { dialColors } from "@/data/watch-properties"
import { SlidersHorizontal, ChevronDown, ChevronUp, Watch, Gift, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { useBrandsAndModels } from "@/hooks/useBrandsAndModels"
import { useRouter, useSearchParams } from "next/navigation"
import { useFavorites } from "@/hooks/useFavorites"
import { useAuthGuard } from "@/hooks/useAuthGuard"

interface Brand {
  id: string
  slug: string
  label: string
  popular: boolean
}

interface Model {
  id: string
  brand_id: string
  slug: string
  label: string
  popular: boolean
}

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
}

export default function ListingsPage() {
  const { isAuthorized, isLoading: isAuthLoading } = useAuthGuard({
    requireAuth: true,
    requireSeller: true,
    requireVerified: true
  })
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }
  const router = useRouter()
  const searchParams = useSearchParams()
  const { brands, models, isLoading: isLoadingBrands, error: brandsError, fetchModels } = useBrandsAndModels()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  
  // Initialize filters from URL params
  const getInitialFilters = () => {
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
    }
  }

  const [filters, setFilters] = useState<Filters>(getInitialFilters())
  const [tempFilters, setTempFilters] = useState<Filters>(filters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance")
  const [listings, setListings] = useState<Listing[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedBrandId, setSelectedBrandId] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const itemsPerPage = 12
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    watch: true,
    condition: false,
    price: false,
    shipping: false,
  })
  const [isLoadingModels, setIsLoadingModels] = useState(false)

  // Debounce function pour optimiser les recherches
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const handleFilterChange = debounce((key: keyof Filters, value: string) => {
    setTempFilters(prev => ({ ...prev, [key]: value }))
  }, 300)

  // Validation des paramètres d'URL
  const validateURLParams = (params: URLSearchParams) => {
    const validParams: Record<string, string> = {}
    const errors: string[] = []

    // Validation de la page
    const page = params.get("page")
    if (page && (isNaN(Number(page)) || Number(page) < 1)) {
      errors.push("Invalid page number")
    } else if (page) {
      validParams.page = page
    }

    // Validation du tri
    const sort = params.get("sort")
    const validSorts = ["relevance", "popular", "price-asc", "price-desc"]
    if (sort && !validSorts.includes(sort)) {
      errors.push("Invalid sort parameter")
    } else if (sort) {
      validParams.sort = sort
    }

    // Validation des prix
    const minPrice = params.get("minPrice")
    const maxPrice = params.get("maxPrice")
    if (minPrice && (isNaN(Number(minPrice)) || Number(minPrice) < 0)) {
      errors.push("Invalid minimum price")
    } else if (minPrice) {
      validParams.minPrice = minPrice
    }
    if (maxPrice && (isNaN(Number(maxPrice)) || Number(maxPrice) < 0)) {
      errors.push("Invalid maximum price")
    } else if (maxPrice) {
      validParams.maxPrice = maxPrice
    }
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      errors.push("Minimum price cannot be greater than maximum price")
    }

    // Validation de l'année
    const year = params.get("year")
    if (year && (isNaN(Number(year)) || Number(year) < 1800 || Number(year) > new Date().getFullYear())) {
      errors.push("Invalid year")
    } else if (year) {
      validParams.year = year
    }

    return {
      validParams,
      errors: errors.length > 0 ? errors : null
    }
  }

  const updateURL = (newFilters: Filters, page: number = 1, sort: string = sortBy) => {
    const params = new URLSearchParams()
    
    // Add non-empty filters to URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    // Add pagination and sorting
    if (page > 1) params.set("page", page.toString())
    if (sort !== "relevance") params.set("sort", sort)

    // Validate parameters before updating URL
    const { validParams, errors } = validateURLParams(params)
    if (errors) {
      setError(errors.join(", "))
      return
    }

    // Update URL without reloading the page
    router.push(`/listings?${params.toString()}`, { scroll: false })
  }

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value)
    setTempFilters(prev => ({ ...prev, brand: value, model: "" }))
    
    // Find the selected brand to get its ID
    const selectedBrandData = brands.find((b: Brand) => b.slug === value)
    if (selectedBrandData) {
      setSelectedBrandId(selectedBrandData.id)
      setIsLoadingModels(true)
      fetchModels(selectedBrandData.id).finally(() => {
        setIsLoadingModels(false)
      })
    }
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    setTempFilters(prev => ({ ...prev, model: value }))
  }

  const handleApplyFilters = () => {
    setFilters(tempFilters)
    setCurrentPage(1)
    updateURL(tempFilters, 1)
    setIsFiltersOpen(false)
  }

  const handleClearFilters = () => {
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
    }
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
    setCurrentPage(1)
    updateURL(emptyFilters, 1)
    setIsFiltersOpen(false)
  }

  // Initialize filters from URL on mount
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

        const initialFilters = getInitialFilters()
        setFilters(initialFilters)
        setTempFilters(initialFilters)

        // Initialize brand selection if brand is in URL
        const brandSlug = searchParams.get("brand")
        if (brandSlug) {
          const brand = brands.find((b: Brand) => b.slug === brandSlug)
          if (brand) {
            setSelectedBrand(brandSlug)
            setSelectedBrandId(brand.id)
            await fetchModels(brand.id)
          } else {
            setError(`Brand "${brandSlug}" not found`)
          }
        }

        setIsInitialized(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to initialize filters")
        setIsInitialized(true) // Still set initialized to true to allow retry
      }
    }

    if (brands.length > 0) {
      initializeFromURL()
    }
  }, [brands])

  // Fetch listings only after initialization
  useEffect(() => {
    if (isInitialized) {
      fetchListings()
    }
  }, [currentPage, sortBy, filters, isInitialized])

  const fetchListings = async () => {
    if (!isInitialized) return

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
          if (key === "brand") {
            const brand = brands.find((b: Brand) => b.slug === value)
            if (brand) {
              params.append("brand_id", brand.id)
            }
          } else if (key === "model") {
            const model = selectedBrandId && models[selectedBrandId]?.find((m: Model) => m.slug === value)
            if (model) {
              params.append("model_id", model.id)
            }
          } else {
            params.append(key, value)
          }
        }
      })

      const response = await fetch(`/api/listings?${params}`)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to fetch listings')
      }
      const data: ListingsResponse = await response.json()

      setListings(data.listings || [])
      setTotalItems(data.total || 0)
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error('Error fetching listings:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch listings')
      setListings([])
      setTotalItems(0)
      setTotalPages(0)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const FilterSection = ({ title, children, section }: { title: string, children: React.ReactNode, section: string }) => (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="font-semibold">{title}</h2>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  )

  const renderFilters = () => (
    <div className="space-y-6 h-[calc(100vh-8rem)] overflow-y-auto pl-2 pr-2">
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFilterChange("listingType", "watch")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
              tempFilters.listingType === "watch"
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            }`}
          >
            <Watch className="w-6 h-6 md:w-8 md:h-8 text-primary mb-1" />
            <span className="font-medium text-sm">Watch</span>
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("listingType", "accessory")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
              tempFilters.listingType === "accessory"
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            }`}
          >
            <Gift className="w-6 h-6 md:w-8 md:h-8 text-primary mb-1" />
            <span className="font-medium text-sm">Accessory</span>
          </button>
        </div>
      </div>

      <FilterSection title="Watch Selection" section="watch">
        {/* Popular Brands */}
        <div className="space-y-2">
          <Label>Popular Brands</Label>
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {brands.filter((brand: Brand) => brand.popular).map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => handleBrandChange(brand.slug)}
                className={`relative aspect-square rounded-lg border-2 transition-colors ${
                  tempFilters.brand === brand.slug
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2">
                  <Image
                    src={`/images/brands/${brand.slug}.png`}
                    alt={brand.label}
                    fill
                    className="object-contain p-1 sm:p-2"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Brand</Label>
          <Select
            value={tempFilters.brand}
            onValueChange={(value) => handleBrandChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.slug}>
                  {brand.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedBrandId && models[selectedBrandId] && (
          <>
            {/* Popular Models */}
            <div className="space-y-2">
              <Label>Popular Models</Label>
              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                {models[selectedBrandId]
                  .filter((model: Model) => model.popular)
                  .map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleModelChange(model.slug)}
                      className={`relative aspect-[3/1] rounded-lg border-2 transition-colors ${
                        tempFilters.model === model.slug
                          ? "border-primary bg-primary/5"
                          : "border-input hover:border-primary/50"
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                        <span className="text-xs font-medium text-center line-clamp-1 break-words w-full px-1">
                          {model.label}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Model</Label>
              <Select
                value={tempFilters.model}
                onValueChange={(value) => handleModelChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models[selectedBrandId]?.map((model: Model) => (
                    <SelectItem key={model.id} value={model.slug}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </FilterSection>

      <FilterSection title="Condition & Details" section="condition">
        <div className="space-y-2">
          <Label>Condition</Label>
          <Select
            value={tempFilters.condition}
            onValueChange={(value) => handleFilterChange("condition", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              {watchConditions.map((condition) => (
                <SelectItem key={condition.slug} value={condition.slug}>
                  {condition.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Dial Color</Label>
          <Select
            value={tempFilters.dialColor}
            onValueChange={(value) => handleFilterChange("dialColor", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {dialColors.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Included</Label>
          <Select
            value={tempFilters.included}
            onValueChange={(value) => handleFilterChange("included", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-set">Full set (Box & Papers)</SelectItem>
              <SelectItem value="box-only">Box only</SelectItem>
              <SelectItem value="papers-only">Papers only</SelectItem>
              <SelectItem value="watch-only">Watch only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterSection>

      <FilterSection title="Price Range" section="price">
        <div className="space-y-2">
          <Label>Min Price</Label>
          <Input
            type="number"
            placeholder="Min price"
            value={tempFilters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Price</Label>
          <Input
            type="number"
            placeholder="Max price"
            value={tempFilters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </FilterSection>

      <FilterSection title="Shipping" section="shipping">
        <div className="space-y-2">
          <Label>Shipping Delay</Label>
          <Select
            value={tempFilters.shippingDelay}
            onValueChange={(value) => handleFilterChange("shippingDelay", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select delay" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-2">1-2 business days</SelectItem>
              <SelectItem value="2-3">2-3 business days</SelectItem>
              <SelectItem value="3-5">3-5 business days</SelectItem>
              <SelectItem value="5-7">5-7 business days</SelectItem>
              <SelectItem value="7-10">7-10 business days</SelectItem>
              <SelectItem value="10+">More than 10 business days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterSection>
    </div>
  )

  const getFilterLabel = (key: keyof Filters, value: string) => {
    switch (key) {
      case "brand":
        return brands.find(b => b.slug === value)?.label || value
      case "model":
        return selectedBrandId && models[selectedBrandId]?.find(m => m.slug === value)?.label || value
      case "condition":
        return watchConditions.find(c => c.slug === value)?.label || value
      case "dialColor":
        return value
      case "included":
        return value === "full-set" ? "Full set" :
               value === "box-only" ? "Box only" :
               value === "papers-only" ? "Papers only" :
               value === "watch-only" ? "Watch only" : value
      case "shippingDelay":
        return `${value} business days`
      case "listingType":
        return value === "watch" ? "Watch" : "Accessory"
      default:
        return value
    }
  }

  const removeFilter = (key: keyof Filters) => {
    const newFilters = { ...filters, [key]: "" }
    setTempFilters(newFilters)
    setFilters(newFilters)
    updateURL(newFilters)
  }

  // Update URL when page changes
  useEffect(() => {
    if (currentPage > 1) {
      updateURL(filters, currentPage)
    }
  }, [currentPage])

  // Update URL when sort changes
  useEffect(() => {
    if (sortBy !== "relevance") {
      updateURL(filters, currentPage, sortBy)
    }
  }, [sortBy])

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg md:text-2xl font-bold">
              {totalItems.toLocaleString()} listings
            </h1>
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price ascending</SelectItem>
                <SelectItem value="price-desc">Price descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsFiltersOpen(true)}
              className="h-8"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null
              return (
                <div
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                >
                  <span>{getFilterLabel(key as keyof Filters, value)}</span>
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
            )}
          </div>
        </div>

        {/* Filters Modal */}
        <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <DialogContent className="sm:max-w-[600px] h-[calc(100dvh-4rem)] sm:h-auto p-0 sm:p-6 gap-0 sm:gap-6">
            <DialogHeader className="p-4 sm:p-0">
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <div className="h-[calc(100%-8rem)] sm:h-auto overflow-y-auto px-4 sm:px-0">
              {renderFilters()}
            </div>
            <div className="fixed sm:static bottom-0 left-0 right-0 p-4 sm:p-0 bg-background border-t sm:border-0 flex gap-2 sm:gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleClearFilters}
              >
                Clear filters
              </Button>
              <Button 
                className="flex-1"
                onClick={handleApplyFilters}
              >
                Apply filters
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}