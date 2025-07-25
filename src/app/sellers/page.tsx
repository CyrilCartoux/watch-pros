"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Award, MapPin, Coins, SlidersHorizontal, ChevronDown, ChevronUp, X, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { countries } from "@/data/form-options"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"
import debounce from "lodash.debounce"

interface Seller {
  account: {
    companyName: string
    watchProsName: string
    companyStatus: string
    firstName: string
    lastName: string
    email: string
    country: string
    title: string
    phonePrefix: string
    phone: string
    cryptoFriendly: boolean
    companyLogo?: string
  }
  address: {
    street: string
    city: string
    country: string
    postalCode: string
    website: string
  } | null
  stats: {
    totalReviews: number
    averageRating: number
    lastUpdated: string
  }
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface Filters {
  country: string
  cryptoFriendly: boolean
  minRating: number
  search: string
}

interface TopSellerRpc {
  id: string
  company_name: string
  company_logo_url: string | null
  watch_pros_name: string
  company_status: string
  first_name: string
  last_name: string
  email: string
  country: string
  phone_prefix: string
  phone: string
  crypto_friendly: boolean
  identity_verified: boolean
  average_rating: number
  total_reviews: number
}

function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}


export default function SellersListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Mémoriser les filtres initiaux
  const initialFilters = useMemo(() => ({
    country: searchParams.get("country") || "",
    cryptoFriendly: searchParams.get("cryptoFriendly") === "true",
    minRating: +searchParams.get("minRating")! || 0,
    search: searchParams.get("search") || ""
  }), [searchParams])

  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [tempFilters, setTempFilters] = useState<Filters>(filters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1)
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  })
  const [topSellers, setTopSellers] = useState<TopSellerRpc[]>([])


  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setTempFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const handleApplyFilters = useCallback(() => {
    setFilters(tempFilters)
    setCurrentPage(1)
    setIsFiltersOpen(false)
  }, [tempFilters])

  const handleClearFilters = useCallback(() => {
    const emptyFilters = {
      country: "",
      cryptoFriendly: false,
      minRating: 0,
      search: ""
    }
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
    setCurrentPage(1)
    setIsFiltersOpen(false)
  }, [])

  const removeFilter = useCallback((key: keyof Filters) => {
    const newFilters = { ...filters, [key]: key === "cryptoFriendly" ? false : "" }
    setTempFilters(newFilters)
    setFilters(newFilters)
  }, [filters])

  const handleSearch = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }, [])

  // Mettre à jour l'URL sans recharger la page
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Mettre à jour les filtres dans l'URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    // Mettre à jour la pagination
    if (currentPage > 1) {
      params.set("page", currentPage.toString())
    } else {
      params.delete("page")
    }

    // Mettre à jour l'URL sans recharger la page
    router.push(`/sellers?${params.toString()}`, { scroll: false })
  }, [filters, currentPage, router, searchParams])

  const fetchSellers = async (page: number) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        order: "desc"
      })

      // Add filters to params
      if (filters.country) params.append("country", filters.country)
      if (filters.cryptoFriendly) params.append("cryptoFriendly", "true")
      if (filters.minRating > 0) params.append("minRating", filters.minRating.toString())
      if (filters.search) params.append("search", filters.search)
        
      const response = await fetch(`/api/sellers?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch sellers')
      }
      const data = await response.json()
      setSellers(data.sellers)
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSellers(currentPage)
  }, [currentPage, filters.country, filters.cryptoFriendly, filters.minRating, filters.search])

  // Fetch top sellers au chargement
  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const response = await fetch('/api/sellers?top=3')
        if (!response.ok) throw new Error('Failed to fetch top sellers')
        const data = await response.json()
        setTopSellers(data.sellers)
      } catch (err) {
        // Optionally handle error
      }
    }
    fetchTopSellers()
  }, [])

  const renderFilters = () => (
    <div className="space-y-8">
      {/* Country Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-medium">Country</Label>
        </div>
        <Select
          value={tempFilters.country}
          onValueChange={(value) => handleFilterChange("country", value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCountryFlag(country.value)}</span>
                  <span>{country.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <Label className="text-base font-medium">Rating</Label>
        </div>
        <Select
          value={tempFilters.minRating.toString()}
          onValueChange={(value) => handleFilterChange("minRating", parseFloat(value))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Minimum rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any rating</SelectItem>
            <SelectItem value="4.5">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400/50"}`}
                    />
                  ))}
                </div>
                <span>4.5+ stars</span>
              </div>
            </SelectItem>
            <SelectItem value="4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400/50"}`}
                    />
                  ))}
                </div>
                <span>4+ stars</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Options Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-amber-500" />
          <Label className="text-base font-medium">Payment Options</Label>
        </div>
        <div className="flex items-center space-x-2 p-4 rounded-lg border bg-card">
          <Checkbox
            id="crypto"
            checked={tempFilters.cryptoFriendly}
            onCheckedChange={(checked) => handleFilterChange("cryptoFriendly", checked)}
          />
          <Label htmlFor="crypto" className="flex items-center gap-2 text-base">
            <Coins className="h-5 w-5 text-amber-500" />
            Accepts cryptocurrency
          </Label>
        </div>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            onClick={() => fetchSellers(1)}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">Sellers</h1>
          <p className="text-muted-foreground">
            Browse our verified sellers and find the perfect watch for you.
          </p>
        </div>

        {/* Top Sellers Section */}
        {topSellers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Top sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topSellers.map((seller) => (
                <Link
                  key={seller.watch_pros_name}
                  href={`/sellers/${seller.watch_pros_name}`}
                  className="block group"
                >
                  <div className="relative rounded-xl border border-amber-200 bg-amber-50/30 shadow-md hover:shadow-lg transition-all duration-300 p-1">
                    {/* Super Seller Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium text-xs border border-amber-200">
                        <Award className="h-3 w-3" />
                        Top Seller
                      </span>
                    </div>
                    <Card className="bg-transparent border-none shadow-none">
                      <CardContent className="p-4 pt-8 sm:pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-amber-200 flex items-center justify-center bg-background flex-shrink-0 shadow-sm">
                            {seller.company_logo_url ? (
                              <Image
                                src={seller.company_logo_url}
                                alt={`${seller.company_name} logo`}
                                width={64}
                                height={64}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="text-2xl font-bold text-amber-600">
                                {seller.company_name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate group-hover:text-amber-700 transition-colors">{seller.watch_pros_name}</h3>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="text-sm text-muted-foreground mb-2">{seller.company_status}</p>
                              {seller.crypto_friendly && (
                                <Badge variant="outline" className="text-xs border-amber-500 text-amber-600 bg-amber-50">
                                  <Coins className="h-3 w-3 mr-1" />
                                  Crypto
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                <span className="font-medium">{seller.average_rating?.toFixed ? seller.average_rating.toFixed(1) : seller.average_rating}</span>
                                <span className="text-muted-foreground">({seller.total_reviews})</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-muted-foreground">{getCountryFlag(seller.country)} {countries.find(c => c.value === seller.country)?.label}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search sellers by name or company..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Active Filters */}
        {Object.entries(filters).some(([key, value]) => value && key !== "search") && (
          <div className="flex flex-wrap gap-2">
            {filters.country && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {countries.find(c => c.value === filters.country)?.label}
                <button
                  onClick={() => removeFilter("country")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.cryptoFriendly && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                Crypto Friendly
                <button
                  onClick={() => removeFilter("cryptoFriendly")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.minRating > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {filters.minRating}+ stars
                <button
                  onClick={() => removeFilter("minRating")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-6 px-2"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Sellers list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))
          ) : sellers.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center">
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
              <h3 className="text-lg font-semibold mb-2">No sellers found</h3>
              <p className="text-muted-foreground max-w-sm">
                {Object.values(filters).some(Boolean) 
                  ? "Try adjusting your filters to find what you're looking for."
                  : "There are no sellers available at the moment. Please check back later."}
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
            sellers.map((seller) => (
              <Link
                key={seller.account.watchProsName}
                href={`/sellers/${seller.account.watchProsName}`}
                className="block hover:shadow-lg transition-all duration-300"
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-background flex-shrink-0">
                        {seller.account.companyLogo ? (
                          <Image
                            src={seller.account.companyLogo}
                            alt={`${seller.account.companyName} logo`}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="text-2xl font-bold text-primary">
                            {seller.account.companyName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">{seller.account.watchProsName}</h3>
                          {seller.account.cryptoFriendly && (
                            <Badge variant="outline" className="text-xs border-amber-500 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20">
                              <Coins className="h-3 w-3 mr-1" />
                              Crypto
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{seller.account.companyStatus}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="font-medium">{seller.stats.averageRating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({seller.stats.totalReviews})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{getCountryFlag(seller.account.country)} {countries.find(c => c.value === seller.account.country)?.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => fetchSellers(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </Button>
              
              {/* First page */}
              {pagination.currentPage > 3 && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => fetchSellers(1)}
                  >
                    1
                  </Button>
                  {pagination.currentPage > 4 && <span className="px-2">...</span>}
                </>
              )}

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === pagination.currentPage ? "default" : "outline"}
                    onClick={() => fetchSellers(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              {/* Last page */}
              {pagination.currentPage < pagination.totalPages - 2 && (
                <>
                  {pagination.currentPage < pagination.totalPages - 3 && <span className="px-2">...</span>}
                  <Button
                    variant="outline"
                    onClick={() => fetchSellers(pagination.totalPages)}
                  >
                    {pagination.totalPages}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                onClick={() => fetchSellers(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>

            {/* Page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Go to page:</span>
              <Select
                value={pagination.currentPage.toString()}
                onValueChange={(value) => fetchSellers(Number(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Page" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <SelectItem key={page} value={page.toString()}>
                      {page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">
                of {pagination.totalPages}
              </span>
            </div>
          </div>
        )}

        {/* Filters Modal */}
        <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Filters</DialogTitle>
            </DialogHeader>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto pl-2 pr-2">
              {renderFilters()}
            </div>
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear all
              </Button>
              <Button onClick={handleApplyFilters}>Apply filters</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  )
}