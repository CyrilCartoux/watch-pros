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
import { SlidersHorizontal, ChevronDown, ChevronUp, Watch, Gift } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { useBrandsAndModels } from "@/hooks/useBrandsAndModels"

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
  const { brands, models, isLoading: isLoadingBrands, error: brandsError, fetchModels } = useBrandsAndModels()
  const [filters, setFilters] = useState<Filters>({
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
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("relevance")
  const [listings, setListings] = useState<Listing[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedBrandId, setSelectedBrandId] = useState<string>("")
  const itemsPerPage = 12
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    watch: true,
    condition: true,
    price: true,
    shipping: true,
  })

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value)
    setFilters(prev => ({ ...prev, brand: value, model: "" }))
    setCurrentPage(1)
    
    // Find the selected brand to get its ID
    const selectedBrandData = brands.find((b: Brand) => b.slug === value)
    if (selectedBrandData) {
      setSelectedBrandId(selectedBrandData.id)
      fetchModels(selectedBrandData.id)
    }
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

      // Add all filters to params
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          if (key === "brand") {
            // Convert brand slug to brand_id
            const brand = brands.find((b: Brand) => b.slug === value)
            if (brand) {
              params.append("brand_id", brand.id)
            }
          } else if (key === "model") {
            // Convert model slug to model_id
            const model = selectedBrandId && models[selectedBrandId]?.find((m: Model) => m.slug === value)
            if (model) {
              params.append("model_id", model.id)
            }
          } else {
        params.append(key, value)
          }
        }
      })

      console.log("Fetching listings with params:", Object.fromEntries(params.entries()))

      const response = await fetch(`/api/listings?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch listings')
      }
      const data: ListingsResponse = await response.json()

      setListings(data.listings || [])
      setTotalItems(data.total || 0)
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error('Error fetching listings:', error)
      setListings([])
      setTotalItems(0)
      setTotalPages(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [currentPage, sortBy, filters])

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
      <div className="space-y-4">
        <h2 className="font-semibold">Search</h2>
        <Input
          placeholder="Search listings..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setFilters({
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
        })}
      >
        Clear all filters
      </Button>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFilterChange("listingType", "watch")}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
              filters.listingType === "watch"
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
              filters.listingType === "accessory"
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
                  filters.brand === brand.slug
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
            value={filters.brand}
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
                      onClick={() => handleFilterChange("model", model.slug)}
                      className={`relative aspect-[3/1] rounded-lg border-2 transition-colors ${
                        filters.model === model.slug
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
                value={filters.model}
                onValueChange={(value) => handleFilterChange("model", value)}
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
            value={filters.condition}
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
            value={filters.dialColor}
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
            value={filters.included}
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
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Price</Label>
          <Input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
          />
        </div>
      </FilterSection>

      <FilterSection title="Shipping" section="shipping">
        <div className="space-y-2">
          <Label>Shipping Delay</Label>
          <Select
            value={filters.shippingDelay}
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

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">
              {totalItems.toLocaleString()} listings
            </h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px] h-[100dvh] sm:h-auto p-0 sm:p-6 gap-0 sm:gap-6">
                <DialogHeader className="p-6 sm:p-0">
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <div className="h-[calc(100dvh-5rem)] sm:h-auto overflow-y-auto px-6 sm:px-0">
                  {renderFilters()}
                </div>
                <div className="fixed sm:static bottom-0 left-0 right-0 p-4 sm:p-0 bg-background border-t sm:border-0 flex gap-2 sm:gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setFilters({
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
                    })}
                  >
                    Clear filters
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      const dialog = document.querySelector('[role="dialog"]')
                      if (dialog) {
                        (dialog as HTMLDialogElement).close()
                      }
                    }}
                  >
                    Apply filters
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="w-[140px] sm:w-[180px]">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            {renderFilters()}
          </div>

          {/* Listings Grid */}
          <div className="lg:col-span-3">
        {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    onClick={() => setFilters({
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
                    })}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
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
      </div>
    </main>
  )
}