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
import { dialColors, includedOptions } from "@/data/watch-properties"
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

interface FullFilters {
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
  onClearFilters: () => void
  onApplyFilters: (filters: Partial<FullFilters>) => void
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
  onClearFilters,
  onApplyFilters,
}: ModalFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Partial<FullFilters>>({})
  const { brands, models, isLoading: isLoadingBrands, error: brandsError, fetchModels } = useBrandsAndModels()
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [openSections, setOpenSections] = useState({
    watch: true,
    condition: false,
    price: false,
    shipping: false
  })

  useEffect(() => {
    const brandSlug = localFilters.brand || ""
    const modelSlug = localFilters.model || ""
    const reference = localFilters.reference || ""

    const brandLabel = brands.find(b => b.slug === brandSlug)?.label || ""
    
    const modelLabel = selectedBrandId && models[selectedBrandId]
      ? models[selectedBrandId].find(m => m.slug === modelSlug)?.label || ""
      : ""

    const queryParts = [brandLabel, modelLabel, reference].filter(Boolean)
    const newQuery = queryParts.join(' ')

    setLocalFilters(prev => ({...prev, query: newQuery}))

  }, [localFilters.brand, localFilters.model, localFilters.reference, brands, models, selectedBrandId])

  const handleFilterChange = (key: keyof FullFilters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleBrandChange = (value: string) => {
    const brand = brands.find(b => b.slug === value)
    if (brand) {
      setSelectedBrandId(brand.id)
      fetchModels(brand.id)
    }
    setLocalFilters(prev => ({ ...prev, brand: value, model: "", reference: "" }))
  }

  const handleModelChange = (value: string) => {
    setLocalFilters(prev => ({ ...prev, model: value }))
  }

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, reference: e.target.value }))
  }

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }


  return (
    <div className="space-y-6 h-[calc(100vh-12rem)] sm:h-[calc(100vh-8rem)] overflow-y-auto px-2 pb-24">
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
                  localFilters.brand === brand.slug
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
            value={localFilters.brand || ""}
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
                        localFilters.model === model.slug
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
                value={localFilters.model || ""}
                onValueChange={handleModelChange}
                disabled={!selectedBrandId || isLoadingModels}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {selectedBrandId && !isLoadingModels && models[selectedBrandId]?.map(model => (
                    <SelectItem key={model.slug} value={model.slug}>{model.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Reference Number */}
        <div className="space-y-2">
          <Label>Reference</Label>
          <Input
            type="text"
            name="reference"
            placeholder="e.g. 116500LN"
            value={localFilters.reference || ""}
            onChange={handleReferenceChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

        {/* Dial Color */}
        <div className="space-y-2">
            <Label>Dial Color</Label>
            <Select
              name="dialColor"
              value={localFilters.dialColor || ""}
              onValueChange={value => handleFilterChange("dialColor", value)}
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
              name="country"
              value={localFilters.country || ""}
              onValueChange={value => handleFilterChange("country", value)}
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
              name="condition"
              value={localFilters.condition || ""}
              onValueChange={value => handleFilterChange("condition", value)}
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
              name="included"
              value={localFilters.included || ""}
              onValueChange={value => handleFilterChange("included", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {includedOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.title}
                  </SelectItem>
                ))}
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
                name="minPrice"
                placeholder="e.g. 5000"
                value={localFilters.minPrice || ""}
                onChange={e => handleFilterChange("minPrice", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Price</Label>
              <Input
                type="number"
                name="maxPrice"
                placeholder="e.g. 20000"
                value={localFilters.maxPrice || ""}
                onChange={e => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="space-y-2">
          <Label>Max Shipping Delay (days)</Label>
          <Select
            name="shippingDelay"
            value={localFilters.shippingDelay || ""}
            onValueChange={value => handleFilterChange("shippingDelay", value)}
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

      <div className="fixed bottom-0 left-0 right-0 bg-background p-4 border-t w-full">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button variant="outline" onClick={() => {
            setLocalFilters({})
            onClearFilters()
          }}>Clear Filters</Button>
          <Button onClick={() => onApplyFilters(localFilters)}>Apply Filters</Button>
        </div>
      </div>
    </div>
  )
} 