"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { useBrandsAndModels } from '@/hooks/useBrandsAndModels'
import { countries } from '@/data/form-options'
import Image from 'next/image'
import { CustomAlertInsert } from "@/types/db/notifications/CustomAlerts"

// Add a component to display errors
const FormError = ({ error, isSubmitted }: { error?: string, isSubmitted: boolean }) => {
  if (!error || !isSubmitted) return null
  return <p className="text-sm text-red-500 mt-1">{error}</p>
}

// Validation schema for the alert form
const alertSchema = z.object({
  brand_id: z.string(),
  model_id: z.string(),
  reference: z.string().nullable(),
  max_price: z.number().nullable(),
  location: z.string().nullable(),
})

interface CustomAlertFormProps {
  onSubmit: (data: Omit<CustomAlertInsert, 'user_id'>) => Promise<void>
  isSubmitting?: boolean
}

// Popular brands list
const popularBrands = [
  {
    slug: "rolex",
    label: "Rolex",
    image: "/images/brands/rolex.png"
  },
  {
    slug: "omega",
    label: "Omega",
    image: "/images/brands/omega.png"
  },
  {
    slug: "audemars-piguet",
    label: "Audemars Piguet",
    image: "/images/brands/audemars-piguet.png"
  },
  {
    slug: "patek-philippe",
    label: "Patek Philippe",
    image: "/images/brands/patek-philippe.png"
  },
  {
    slug: "cartier",
    label: "Cartier",
    image: "/images/brands/cartier.png"
  }
]

export default function CustomAlertForm({ onSubmit, isSubmitting = false }: CustomAlertFormProps) {
  const [selectedBrand, setSelectedBrand] = useState("")
  const [isStepSubmitted, setIsStepSubmitted] = useState(false)
  const { toast } = useToast()
  const { brands, models, isLoading, fetchModels } = useBrandsAndModels()

  const form = useForm<Omit<CustomAlertInsert, 'user_id'>>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      brand_id: "",
      model_id: "",
      reference: "",
      max_price: null,
      location: "",
    },
  })

  const handleBrandChange = async (value: string) => {
    setSelectedBrand(value)
    form.setValue("brand_id", value)
    form.setValue("model_id", "")
    await fetchModels(value)
  }

  const handleModelChange = (value: string) => {
    form.setValue("model_id", value)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get the popular brands from the brands list
  const popularBrandsData = popularBrands.map(popularBrand => {
    const brand = brands.find(b => b.slug === popularBrand.slug)
    return brand || null
  }).filter(Boolean)

  return (
    <Card>
      <CardContent className="p-6">
        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Create a Custom Alert</h3>
            <p className="text-sm text-muted-foreground">
              Set up an alert to be notified when a watch matching your criteria is listed.
            </p>

            {/* Watch Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select your watch</h3>
              
              {/* Popular Brands */}
              <div className="space-y-2">
                <Label>Popular Brands *</Label>
                <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
                  {popularBrandsData.map((brand) => (
                    brand && (
                      <button
                        key={brand.id}
                        type="button"
                        onClick={() => handleBrandChange(brand.id)}
                        className={`relative aspect-square rounded-lg border-2 transition-colors ${
                          form.watch("brand_id") === brand.id
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
                    )
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Controller
                  name="brand_id"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={handleBrandChange} value={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={form.formState.errors.brand_id?.message} isSubmitted={isStepSubmitted} />
              </div>

              {/* Popular Models */}
              {selectedBrand && models[selectedBrand] && (
                <div className="space-y-2">
                  <Label>Models {brands.find(b => b.id === selectedBrand)?.label} *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                    {models[selectedBrand]
                      .filter(model => model.popular)
                      .map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => handleModelChange(model.id)}
                          className={`relative aspect-[4/1] sm:aspect-[3/2] rounded-lg border-2 transition-colors ${
                            form.watch("model_id") === model.id
                              ? "border-primary bg-primary/5"
                              : "border-input hover:border-primary/50"
                          }`}
                        >
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5 sm:p-2">
                            <span className="text-[10px] sm:text-xs font-medium text-center line-clamp-1 sm:line-clamp-2 break-words w-full px-0.5">
                              {model.label}
                            </span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {selectedBrand && (
                <div className="space-y-2">
                  <Controller
                    name="model_id"
                    control={form.control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={handleModelChange} 
                        value={field.value || ""}
                        disabled={!selectedBrand}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          {models[selectedBrand]?.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormError error={form.formState.errors.model_id?.message} isSubmitted={isStepSubmitted} />
                </div>
              )}

              <div>
                <Label htmlFor="reference">Reference Number (optional)</Label>
                <Input 
                  id="reference" 
                  placeholder="e.g. 18038" 
                  {...form.register("reference")} 
                />
                <FormError error={form.formState.errors.reference?.message} isSubmitted={isStepSubmitted} />
              </div>
            </div>

            {/* Price and Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Filters</h3>

              {/* Max Price */}
              <div className="space-y-2">
                <Label htmlFor="max_price">Maximum Price (optional)</Label>
                <Controller
                  name="max_price"
                  control={form.control}
                  render={({ field }) => (
                    <Input 
                      id="max_price" 
                      type="number"
                      placeholder="e.g. 18000" 
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value === '' ? null : Number(e.target.value)
                        field.onChange(value)
                      }}
                    />
                  )}
                />
                <FormError error={form.formState.errors.max_price?.message} isSubmitted={isStepSubmitted} />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Controller
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormError error={form.formState.errors.location?.message} isSubmitted={isStepSubmitted} />
              </div>
            </div>
          </div>

          <Button 
            type="button"
            onClick={async () => {
              setIsStepSubmitted(true)
              const isValid = await form.trigger()
              
              if (!isValid) {
                return
              }

              const data = form.getValues()
              try {
                await onSubmit(data)
                toast({
                  title: "Alert created",
                  description: "You will be notified when a matching watch is listed.",
                })
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to create alert. Please try again.",
                  variant: "destructive",
                })
              }
            }}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating alert..." : "Create Alert"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 