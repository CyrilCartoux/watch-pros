import { useState, useEffect } from "react"
import { Watch, Gift, ChevronUp, ChevronDown } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { watchConditions } from "@/data/watch-conditions"
import { dialColors } from "@/data/watch-properties"
import { ListingType } from "@/types/enums/listings-enum"
import { useBrandsAndModels } from "@/hooks/useBrandsAndModels"
import { countries } from "@/data/form-options"

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

interface Filters {
  query: string
  brand: string
  model: string
  reference: string
  dialColor: string
  condition: string
  included: string
  minPrice: string
  maxPrice: string
  shippingDelay: string
  listingType: string
  country: string
}

interface ModalFiltersProps {
  tempFilters: Filters
  onFilterChange: (key: keyof Filters, value: string) => void
  onClearFilters: () => void
  onApplyFilters: () => void
}

const FilterSection = ({ title, children, isOpen, onToggle }: { 
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void 
}) => (
  <div className="space-y-4">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left"
    >
      <h2 className="font-semibold">{title}</h2>
      {isOpen ? (
        <ChevronUp className="h-4 w-4 text-muted-foreground" />
      ) : (
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      )}
    </button>
    {isOpen && (
      <div className="space-y-4">
        {children}
      </div>
    )}
  </div>
)

export function ModalFilters({
  tempFilters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}: ModalFiltersProps) {
  const { brands, models, isLoading: isLoadingBrands, error: brandsError, fetchModels } = useBrandsAndModels()
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [openSections, setOpenSections] = useState({
    watch: true,
    condition: false,
    price: false,
    shipping: false
  })

  // Synchroniser selectedBrandId avec tempFilters.brand
  useEffect(() => {
    if (tempFilters.brand) {
      const brand = brands.find(b => b.slug === tempFilters.brand)
      if (brand) {
        setSelectedBrandId(brand.id)
        fetchModels(brand.id)
      }
    }
  }, [tempFilters.brand, brands, fetchModels])

  // Fonction pour construire la query à partir des sélections
  const buildQueryFromSelections = (brand: string, model: string, reference: string) => {
    const parts = []
    if (brand) parts.push(brand)
    if (model) parts.push(model)
    if (reference) parts.push(reference)
    return parts.join(' ')
  }

  const handleBrandChange = (value: string) => {
    const brand = brands.find(b => b.slug === value)
    if (brand) {
      setSelectedBrandId(brand.id)
      fetchModels(brand.id)
    }
    onFilterChange("brand", value)
    onFilterChange("model", "")
    onFilterChange("reference", "")
    
    // Construire la query avec la nouvelle sélection
    const newQuery = buildQueryFromSelections(value, "", "")
    onFilterChange("query", newQuery)
  }

  const handleModelChange = (value: string) => {
    onFilterChange("model", value)
    
    // Construire la query avec la nouvelle sélection
    const newQuery = buildQueryFromSelections(tempFilters.brand, value, tempFilters.reference)
    onFilterChange("query", newQuery)
  }

  const handleReferenceChange = (value: string) => {
    onFilterChange("reference", value)
    
    // Construire la query avec la nouvelle sélection
    const newQuery = buildQueryFromSelections(tempFilters.brand, tempFilters.model, value)
    onFilterChange("query", newQuery)
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getFilterLabel = (key: keyof Filters, value: string) => {
    switch (key) {
      case "brand":
        return brands.find(b => b.slug === value)?.label || value
      case "model":
        const brand = brands.find(b => b.slug === tempFilters.brand)
        return brand && models[brand.id]?.find(m => m.slug === value)?.label || value
      case "condition":
        return value === "new" ? "New" : "Pre-owned"
      case "dialColor":
        return value.charAt(0).toUpperCase() + value.slice(1)
      case "included":
        return value.charAt(0).toUpperCase() + value.slice(1)
      case "shippingDelay":
        return value === "1" ? "1 day" : `${value} days`
      case "listingType":
        return value === "buy" ? "Buy Now" : "Auction"
      default:
        return value
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] overflow-y-auto px-2 pb-24">
      {/* Type Selection */}
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onFilterChange("listingType", ListingType.WATCH)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
              tempFilters.listingType === ListingType.WATCH
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            }`}
          >
            <Watch className="w-6 h-6 md:w-8 md:h-8 text-primary mb-1" />
            <span className="font-medium text-sm">Watch</span>
          </button>
          <button
            type="button"
            onClick={() => onFilterChange("listingType", ListingType.ACCESSORY)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-colors ${
              tempFilters.listingType === ListingType.ACCESSORY
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            }`}
          >
            <Gift className="w-6 h-6 md:w-8 md:h-8 text-primary mb-1" />
            <span className="font-medium text-sm">Accessory</span>
          </button>
        </div>
      </div>

      {/* Watch Selection */}
      <FilterSection 
        title="Watch Selection" 
        isOpen={openSections.watch}
        onToggle={() => toggleSection("watch")}
      >
        {/* Popular Brands */}
        <div className="space-y-2">
          <Label>Popular Brands</Label>
          <div className="grid grid-cols-5 gap-1 sm:gap-2">
            {brands.filter((brand) => brand.popular).map((brand) => (
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
              <div className="grid grid-cols-2 gap-1">
                {models[selectedBrandId]
                  .filter((model) => model.popular)
                  .map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => handleModelChange(model.slug)}
                      className={`relative aspect-[4/1] rounded-lg border-2 transition-colors ${
                        tempFilters.model === model.slug
                          ? "border-primary bg-primary/5"
                          : "border-input hover:border-primary/50"
                      }`}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5">
                        <span className="text-[10px] font-medium text-center line-clamp-1 break-words w-full px-0.5">
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
                  {models[selectedBrandId]?.map((model) => (
                    <SelectItem key={model.id} value={model.slug}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Reference Number */}
        <div className="space-y-2">
          <Label>Reference Number</Label>
          <Input
            type="text"
            placeholder="Enter reference number"
            value={tempFilters.reference}
            onChange={(e) => handleReferenceChange(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

        {/* Dial Color */}
        <div className="space-y-2">
            <Label>Dial Color</Label>
            <Select
              value={tempFilters.dialColor}
              onValueChange={(value) => onFilterChange("dialColor", value)}
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

          {/* Country */}
          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={tempFilters.country || ""}
              onValueChange={(value) => onFilterChange("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    <span className="mr-2">{country.flag}</span>{country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FilterSection>

      {/* Quick Filters */}
      <div className="space-y-6">
        <h3 className="font-medium text-lg">Other Filters</h3>
        
        {/* Condition & Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select
              value={tempFilters.condition}
              onValueChange={(value) => onFilterChange("condition", value)}
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
            <Label>Included</Label>
            <Select
              value={tempFilters.included}
              onValueChange={(value) => onFilterChange("included", value)}
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
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <h3 className="font-medium">Price Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Price</Label>
              <Input
                type="number"
                placeholder="Min price"
                value={tempFilters.minPrice}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Price</Label>
              <Input
                type="number"
                placeholder="Max price"
                value={tempFilters.maxPrice}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="space-y-2">
          <Label>Shipping Delay</Label>
          <Select
            value={tempFilters.shippingDelay}
            onValueChange={(value) => onFilterChange("shippingDelay", value)}
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t flex gap-2 sm:gap-4 z-50">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
        <Button 
          className="flex-1"
          onClick={onApplyFilters}
        >
          Apply filters
        </Button>
      </div>
    </div>
  )
} 