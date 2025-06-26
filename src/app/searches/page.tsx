"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  MapPin, 
  Euro, 
  Watch, 
  Package, 
  X,
  Plus,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  User,
  Coins,
  Copy,
  CheckCircle
} from "lucide-react"
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
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { countries } from "@/data/form-options"
import { ActiveSearchInsert } from "@/types/db/ActiveSearches"
import ActiveSearchForm from "@/components/forms/ActiveSearchForm"
import { useBrandsAndModels } from "@/hooks/useBrandsAndModels"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

interface ActiveSearch {
  id: string
  title: string
  description: string | null
  type: 'watch' | 'accessory'
  brand_id: string | null
  model_id: string | null
  reference: string | null
  dial_color: string | null
  max_price: number | string | null
  location: string | null
  accessory_type: string | null
  is_public: boolean
  is_active: boolean
  contact_preferences: {
    email: boolean
    phone: boolean
    whatsapp: boolean
  }
  created_at: string
  updated_at: string
  profiles: {
    id: string
    first_name: string | null
    last_name: string | null
    email: string | null
  } | null
  brands: {
    id: string
    slug: string
    label: string
  } | null
  models: {
    id: string
    slug: string
    label: string
  } | null
  seller?: {
    id: string
    company_name: string
    watch_pros_name: string
    company_status: string
    first_name: string
    last_name: string
    email: string
    country: string
    title: string
    phone_prefix: string
    phone: string
    crypto_friendly: boolean
    identity_verified: boolean
  } | null
}

interface Filters {
  search: string
  query: string
  type: string
  brand: string
  model: string
  maxPrice: string
  location: string
}

function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInHours < 48) return 'Yesterday'
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

export default function ActiveSearchesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  
  // Initialize filters from URL params
  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    return {
      search: params.get("search") || "",
      query: params.get("query") || "",
      type: params.get("type") || "",
      brand: params.get("brand") || "",
      model: params.get("model") || "",
      maxPrice: params.get("maxPrice") || "",
      location: params.get("location") || "",
    }
  }, [searchParams])

  const [filters, setFilters] = useState<Filters>(initialFilters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(12)
  const [searches, setSearches] = useState<ActiveSearch[]>([])
  const [loading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    count: 0
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false)
  const [selectedSearch, setSelectedSearch] = useState<ActiveSearch | null>(null)
  const [message, setMessage] = useState("")
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false)
  const [isMessageSuccess, setIsMessageSuccess] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const { brands, fetchModels, models } = useBrandsAndModels()
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [localFilters, setLocalFilters] = useState<Filters>(filters)

  // When opening the modal, sync localFilters with filters
  useEffect(() => {
    if (isFiltersOpen) setLocalFilters(filters)
  }, [isFiltersOpen])

  // Load models when brand is selected from URL params
  useEffect(() => {
    if (filters.brand) {
      const brandObj = brands.find(b => b.slug === filters.brand)
      if (brandObj) {
        setSelectedBrandId(brandObj.id)
        fetchModels(brandObj.id)
      }
    }
  }, [filters.brand, brands, fetchModels])

  const handleLocalFilterChange = (key: keyof Filters, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
    if (key === "brand") {
      const brandObj = brands.find(b => b.slug === value)
      if (brandObj) {
        setSelectedBrandId(brandObj.id)
        fetchModels(brandObj.id)
      } else {
        setSelectedBrandId(null)
      }
    }
  }

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    if (currentPage > 1) {
      params.set("page", currentPage.toString())
    }

    router.push(`/searches?${params.toString()}`, { scroll: false })
  }, [filters, currentPage, router])

  const fetchSearches = async (page: number) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
      })
      
      const response = await fetch(`/api/searches?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch searches')
      }
      
      const data = await response.json()
      setSearches(data.searches)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching searches:', error)
      toast({
        title: "Error",
        description: "Failed to load active searches",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSearches(currentPage)
  }, [currentPage, filters])

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    const empty: Filters = {
      search: "",
      query: "",
      type: "",
      brand: "",
      model: "",
      maxPrice: "",
      location: "",
    }
    setFilters(empty)
    setCurrentPage(1)
    setIsFiltersOpen(false)
  }

  const removeFilter = (key: keyof Filters) => {
    const newFilters = { ...filters, [key]: "" }
    setFilters(newFilters)
  }

  const handleCreateSearch = async (data: Omit<ActiveSearchInsert, "user_id" | "is_active">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an active search",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create active search')
      }

      toast({
        title: "Success",
        description: "Your active search has been created successfully",
      })
      setIsCreateDialogOpen(false)
      fetchSearches(currentPage) // Refresh the list
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleOpenContactDialog = (search: ActiveSearch) => {
    setSelectedSearch(search)
    setIsContactDialogOpen(true)
    setMessage("")
    setIsMessageSuccess(false)
  }

  const handleCloseContactDialog = () => {
    setIsContactDialogOpen(false)
    setSelectedSearch(null)
    setMessage("")
    setIsMessageSuccess(false)
  }

  const handleSubmitMessage = async () => {
    if (!message.trim() || !user || !selectedSearch?.seller) return

    setIsSubmittingMessage(true)
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          otherUserId: selectedSearch.seller.id,
          initialMessage: message.trim()
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to send message')
      }

      setIsMessageSuccess(true)
      setTimeout(() => {
        handleCloseContactDialog()
      }, 2000)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: "destructive",
      })
    } finally {
      setIsSubmittingMessage(false)
    }
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button 
            onClick={() => fetchSearches(1)}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Active Searches</h1>
            <p className="text-muted-foreground">
              Find what professionals are looking for and connect with potential buyers.
            </p>
          </div>
          {user && (
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Search
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search active searches..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(true)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Active Filters */}
      {Object.entries(filters).some(([key, value]) => value && key !== "search") && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.type === "watch" ? <Watch className="h-3 w-3" /> : <Package className="h-3 w-3" />}
              {filters.type}
              <button
                onClick={() => removeFilter("type")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {brands.find(b => b.slug === filters.brand)?.label}
              <button
                onClick={() => removeFilter("brand")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.model && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedBrandId && models[selectedBrandId]?.find(m => m.slug === filters.model)?.label}
              <button
                onClick={() => removeFilter("model")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.maxPrice && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              Max {filters.maxPrice}€
              <button
                onClick={() => removeFilter("maxPrice")}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {getCountryFlag(filters.location)} {countries.find(c => c.value === filters.location)?.label}
              <button
                onClick={() => removeFilter("location")}
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

      {/* Searches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-5 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="pt-2 border-t">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-24" />
                      <div className="flex gap-1">
                        <Skeleton className="h-3 w-3" />
                        <Skeleton className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
                <Skeleton className="h-8 w-full mt-auto" />
              </CardContent>
            </Card>
          ))
        ) : searches.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-24 h-24 mb-6 text-muted-foreground">
              <Eye className="w-full h-full" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No active searches found</h3>
            <p className="text-muted-foreground max-w-sm">
              {Object.values(filters).some(Boolean) 
                ? "Try adjusting your filters to find what you're looking for."
                : "There are no active searches at the moment. Be the first to create one!"}
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
          searches.map((search) => (
            <Card key={search.id} className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold line-clamp-2 mb-1">
                      {search.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-4 mb-2">
                      {search.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-xs">
                      {search.type === "watch" ? <Watch className="h-3 w-3 mr-1" /> : <Package className="h-3 w-3 mr-1" />}
                      {search.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(search.created_at)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
                {/* Badges */}
                <div className="flex flex-wrap gap-1">
                  {search.brands?.label && <Badge variant="secondary" className="text-xs">{search.brands.label}</Badge>}
                  {search.models?.label && <Badge variant="secondary" className="text-xs">{search.models.label}</Badge>}
                  {search.reference && <Badge variant="secondary" className="text-xs">Ref: {search.reference}</Badge>}
                  {search.dial_color && <Badge variant="secondary" className="text-xs">Dial: {search.dial_color}</Badge>}
                  {search.accessory_type && <Badge variant="secondary" className="text-xs">{search.accessory_type}</Badge>}
                  {search.max_price && <Badge variant="secondary" className="text-xs"><Euro className="h-3 w-3 mr-1" />Max {Number(search.max_price).toLocaleString()}€</Badge>}
                  {search.location && <Badge variant="secondary" className="text-xs"><MapPin className="h-3 w-3 mr-1" />{getCountryFlag(search.location)} {countries.find(c => c.value === search.location)?.label}</Badge>}
                </div>

                {/* Seller Information */}
                {search.seller && (
                  <div className="pt-2 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link href={`/sellers/${search.seller.watch_pros_name}`} className="text-xs font-medium text-primary hover:underline">
                          {search.seller.watch_pros_name}
                        </Link>
                        {search.seller.identity_verified && (
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {search.contact_preferences.email && <Mail className="h-3 w-3 text-blue-600" />}
                        {search.contact_preferences.phone && <Phone className="h-3 w-3 text-green-600" />}
                        {search.contact_preferences.whatsapp && <MessageSquare className="h-3 w-3 text-green-500" />}
                      </div>
                    </div>
                    
                    {/* Additional Seller Details */}
                    <div className="space-y-1">                      
                      {/* Country */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{getCountryFlag(search.seller.country)} {countries.find(c => c.value === search.seller?.country)?.label}</span>
                      </div>
                      
                      {/* Crypto Friendly Badge */}
                      {search.seller.crypto_friendly && (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs border-amber-500 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20">
                              <Coins className="h-3 w-3 mr-1" />
                              Crypto
                            </Badge>
                        </div>
                      )}
                      
                      {/* Contact Information */}
                      <div className="space-y-1">
                        {search.contact_preferences.email && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{search.seller.email}</span>
                          </div>
                        )}
                        {search.contact_preferences.phone && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{search.seller.phone_prefix} {search.seller.phone}</span>
                          </div>
                        )}
                        {search.contact_preferences.whatsapp && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" />
                            <span>WhatsApp: {search.seller.phone_prefix} {search.seller.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Button always at the bottom */}
                <div className="mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => handleOpenContactDialog(search)}
                  >
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="w-full">
          <div className="flex flex-col items-center gap-4 mt-8">
            <div className="flex items-center justify-center flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(Math.max(currentPage - 1, 1))
                }}
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
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
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
              {currentPage < pagination.totalPages - 2 && (
                <>
                  {currentPage < pagination.totalPages - 3 && <span className="px-2">...</span>}
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(pagination.totalPages)}
                  >
                    {pagination.totalPages}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setCurrentPage(Math.min(currentPage + 1, pagination.totalPages))
                }}
                disabled={currentPage === pagination.totalPages}
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
        </div>
      )}

      {/* Create Search Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ActiveSearchForm
            onSubmit={handleCreateSearch}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Filters Modal */}
      <Dialog open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Type filter */}
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={localFilters.type || ""}
                onValueChange={value => setLocalFilters(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watch">Watch</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Brand filter */}
            <div className="space-y-2">
              <Label>Brand</Label>
              <Select
                value={localFilters.brand || ""}
                onValueChange={value => {
                  setLocalFilters(prev => ({ ...prev, brand: value, model: "" }))
                  const brandObj = brands.find(b => b.slug === value)
                  if (brandObj) {
                    setSelectedBrandId(brandObj.id)
                    fetchModels(brandObj.id)
                  } else {
                    setSelectedBrandId(null)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All brands" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem key={brand.id} value={brand.slug}>{brand.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Model filter */}
            <div className="space-y-2">
              <Label>Model</Label>
              <Select
                value={localFilters.model || ""}
                onValueChange={value => setLocalFilters(prev => ({ ...prev, model: value }))}
                disabled={!selectedBrandId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All models" />
                </SelectTrigger>
                <SelectContent>
                  {selectedBrandId && models[selectedBrandId]?.map(model => (
                    <SelectItem key={model.id} value={model.slug}>{model.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Max Price filter */}
            <div className="space-y-2">
              <Label>Maximum Price (€)</Label>
              <Input
                type="number"
                placeholder="e.g., 10000"
                value={localFilters.maxPrice}
                onChange={e => setLocalFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              />
            </div>
            {/* Location filter */}
            <div className="space-y-2">
              <Label>Location</Label>
              <Select
                value={localFilters.location || ""}
                onValueChange={value => setLocalFilters(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.flag} {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setLocalFilters({ search: "", query: "", type: "", brand: "", model: "", maxPrice: "", location: "" })
                  handleClearFilters()
                }}
              >
                Clear all
              </Button>
              <Button onClick={() => {
                setFilters(localFilters)
                setIsFiltersOpen(false)
              }}>
                Apply filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact seller</DialogTitle>
            <DialogDescription>
              Send a message to the seller for more information about this search.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {isMessageSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-primary animate-in zoom-in-50 duration-500" />
                <p className="text-lg font-medium text-center">Your message has been sent successfully!</p>
                <p className="text-sm text-muted-foreground text-center">
                  The seller will respond as soon as possible.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Your message</Label>
                  <Textarea
                    id="message"
                    placeholder="Hello, I have the watch/accessory you're looking for..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    {message.length} / 1000 characters
                  </p>
                </div>
                {selectedSearch?.seller && (
                  <div className="space-y-3 text-sm">
                    {selectedSearch.seller?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSearch.seller.email}</span>
                      </div>
                    )}
                    {selectedSearch.seller?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedSearch.seller.phone_prefix} {selectedSearch.seller.phone}</span>
                      </div>
                    )}
                    {selectedSearch.seller?.crypto_friendly && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-amber-500 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20">
                              <Coins className="h-3 w-3 mr-1" />
                              Crypto
                            </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            {!isMessageSuccess && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCloseContactDialog}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitMessage}
                  disabled={!message.trim() || isSubmittingMessage}
                >
                  {isSubmittingMessage ? "Sending..." : "Send message"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 