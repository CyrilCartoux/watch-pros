"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"
import { dialColors, movements} from "@/data/watch-properties"
import { accessoryTypes, braceletColors, braceletMaterials, lensMaterials, frequencyUnits, glassTypes } from "@/data/accessory-properties"
import { brandsList } from "@/data/brands-list"
import { modelsList } from "@/data/models-list"
import Image from "next/image"

// Add a component to display errors
const FormError = ({ error, isSubmitted }: { error?: string, isSubmitted: boolean }) => {
    if (!error || !isSubmitted) return null
    return <p className="text-sm text-red-500 mt-1">{error}</p>
}

// Validation schema for the accessory form
const accessorySchema = z.object({
  // Common fields
  type: z.string().min(1, "Accessory type is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  title: z.string().min(1, "Title is required").max(60, "Title must not exceed 60 characters"),
  year: z.string().optional(),
  yearUnknown: z.boolean().default(false),
  reference: z.string().optional(),
  description: z.string().optional(),
  condition: z.string().min(1, "Condition is required"),
  images: z.array(z.instanceof(File)).min(1, "At least one photo is required").max(10, "Maximum 10 photos"),
  price: z.number().min(1, "Price is required"),
  currency: z.string().default("EUR"),
  shippingDelay: z.string().min(1, "Shipping delay is required"),
  documents: z.array(z.instanceof(File)).optional(),
  listing_type: z.string().default("accessory"),
  
  // Dimensions
  dimensions: z.object({
    width: z.string().optional(),
    height: z.string().optional(),
    lugWidth: z.string().optional(),
    claspWidth: z.string().optional(),
    braceletLongLength: z.string().optional(),
    braceletShortLength: z.string().optional(),
    braceletThickness: z.string().optional(),
  }).optional(),
  
  // Accessory specific fields
  claspType: z.string().optional(),
  claspMaterial: z.string().optional(),
  caseType: z.string().optional(),
  braceletColor: z.string().optional(),
  braceletMaterial: z.string().optional(),
  dialColor: z.string().optional(),
  caliber: z.string().optional(),
  lensMaterial: z.string().optional(),
  movement: z.string().optional(),
  baseCaliber: z.string().optional(),
  powerReserve: z.string().optional(),
  frequencyUnit: z.string().optional(),
  frequencyValue: z.string().optional(),
  jewels: z.string().optional(),
  glassType: z.string().optional(),
})

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
    image: "/images/brands/ap.png"
  },
  {
    slug: "patek-philippe",
    label: "Patek Philippe",
    image: "/images/brands/patek.png"
  },
  {
    slug: "cartier",
    label: "Cartier",
    image: "/images/brands/cartier.png"
  }
]

export default function SellAccessoryPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImage, setCurrentImage] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStepSubmitted, setIsStepSubmitted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const form = useForm({
    resolver: zodResolver(accessorySchema),
    defaultValues: {
      type: "",
      brand: "",
      model: "",
      title: "",
      year: "",
      yearUnknown: false,
      reference: "",
      dimensions: {
        width: "",
        height: "",
        lugWidth: "",
        claspWidth: "",
        braceletLongLength: "",
        braceletShortLength: "",
        braceletThickness: "",
      },
      description: "",
      condition: "",
      images: [],
      price: 0,
      currency: "EUR",
      shippingDelay: "",
      documents: [],
      claspType: "",
      claspMaterial: "",
      caseType: "",
      braceletColor: "",
      braceletMaterial: "",
      dialColor: "",
      caliber: "",
      lensMaterial: "",
      movement: "",
      baseCaliber: "",
      powerReserve: "",
      frequencyUnit: "",
      frequencyValue: "",
      jewels: "",
      glassType: "",
      listing_type: "accessory",
    },
    mode: "onChange",
  })

  // Auto-complete title when type, brand or model changes
  useEffect(() => {
    const type = form.watch("type")
    const brand = brandsList.find(b => b.slug === form.watch("brand"))?.label
    const model = selectedBrand && modelsList[selectedBrand as keyof typeof modelsList]?.find((m: any) => m.slug === form.watch("model"))?.label

    if (type && brand && model) {
      const suggestedTitle = `${type} - ${brand} - ${model}`
      form.setValue("title", suggestedTitle)
    }
  }, [form.watch("type"), form.watch("brand"), form.watch("model")])

  // Step validation
  const validateStep = async (stepNumber: number) => {
    let fieldsToValidate: (keyof z.infer<typeof accessorySchema>)[] = []

    switch (stepNumber) {
      case 1:
        fieldsToValidate = ["type", "brand", "model", "title"]
        break
      case 2:
        fieldsToValidate = ["condition"]
        break
      case 3:
        fieldsToValidate = ["images"]
        break
      case 4:
        fieldsToValidate = ["price", "shippingDelay"]
        break
    }

    const result = await form.trigger(fieldsToValidate)
    setIsStepSubmitted(true)
    return result
  }

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
    form.setValue("type", value)
  }

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value)
    setSelectedModel("")
    form.setValue("brand", value)
    form.setValue("model", "")
  }

  const handleModelChange = (value: string) => {
    setSelectedModel(value)
    form.setValue("model", value)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // File validation
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size: 5MB`)
        return false
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert(`File ${file.name} is not an accepted image format. Accepted formats: JPG, PNG, WEBP`)
        return false
      }
      return true
    })

    if (validFiles.length + selectedImages.length > 10) {
      alert("You cannot add more than 10 images")
      return
    }

    setSelectedImages(prev => [...prev, ...validFiles])
    form.setValue("images", [...selectedImages, ...validFiles])

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    form.setValue("images", selectedImages.filter((_, i) => i !== index))
  }

  const nextStep = async () => {
    setIsSubmitting(true)
    const isValid = await validateStep(step)
    setIsSubmitting(false)

    if (isValid) {
      setIsStepSubmitted(false)
      setStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setIsStepSubmitted(false)
    setStep(prev => prev - 1)
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // Create FormData to handle file uploads
      const formData = new FormData()
      
      // Add all form fields to FormData
      Object.keys(data).forEach(key => {
        if (key === 'images' || key === 'documents') {
          // Handle files separately
          return
        }
        if (key === 'dimensions') {
          formData.append('dimensions', JSON.stringify(data[key]))
        } else {
          formData.append(key, data[key])
        }
      })

      // Add images
      data.images.forEach((image: File) => {
        formData.append('images', image)
      })

      // Add documents if any
      if (data.documents?.length > 0) {
        data.documents.forEach((doc: File) => {
          formData.append('documents', doc)
        })
      }

      // Send to API
      const response = await fetch('/api/listings', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to create listing')
      }

      router.push("/sell/success")
    } catch (error) {
      console.error(error)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container py-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4">
            List an Accessory for Sale
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Complete the information below to create your listing
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  stepNumber < 5 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stepNumber <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      stepNumber < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground px-2">
            <span className="w-8 text-center">Type</span>
            <span className="w-8 text-center">Condition</span>
            <span className="w-8 text-center">Photos</span>
            <span className="w-8 text-center">Price</span>
            <span className="w-8 text-center">Documents</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-6">
                      {/* Accessory type */}
                      <div className="space-y-2">
                        <Label htmlFor="type">Accessory type *</Label>
                        <Select
                          value={selectedType}
                          onValueChange={handleTypeChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an accessory type" />
                          </SelectTrigger>
                          <SelectContent>
                            {accessoryTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormError error={form.formState.errors.type?.message} isSubmitted={isStepSubmitted} />
                      </div>

                      {/* Popular brands */}
                      <div className="space-y-2">
                        <Label>Popular brands</Label>
                        <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
                          {popularBrands.map((brand) => (
                            <button
                              key={brand.slug}
                              type="button"
                              onClick={() => handleBrandChange(brand.slug)}
                              className={`relative aspect-square rounded-lg border-2 transition-colors ${
                                form.watch("brand") === brand.slug
                                  ? "border-primary bg-primary/5"
                                  : "border-input hover:border-primary/50"
                              }`}
                            >
                              <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2">
                                <Image
                                  src={brand.image}
                                  alt={brand.label}
                                  fill
                                  className="object-contain p-1 sm:p-2"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2"  >
                          <Controller
                            name="brand"
                            control={form.control}
                            render={({ field }) => (
                              <Select onValueChange={handleBrandChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a brand" />
                                </SelectTrigger>
                                <SelectContent>
                                  {brandsList.map((brand) => (
                                    <SelectItem key={brand.slug} value={brand.slug}>
                                      {brand.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <FormError error={form.formState.errors.brand?.message} isSubmitted={isStepSubmitted} />
                        </div>

                      {/* Popular models */}
                      {selectedBrand && modelsList[selectedBrand as keyof typeof modelsList] && (
                        <div className="space-y-2">
                          <Label>Models {brandsList.find(b => b.slug === selectedBrand)?.label}</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                            {modelsList[selectedBrand as keyof typeof modelsList]
                              .slice(0, 4)
                              .map((model: any) => (
                                <button
                                  key={model.slug}
                                  type="button"
                                  onClick={() => handleModelChange(model.slug)}
                                  className={`relative aspect-[4/1] sm:aspect-[3/2] rounded-lg border-2 transition-colors ${
                                    form.watch("model") === model.slug
                                      ? "border-primary bg-primary/5"
                                      : "border-input hover:border-primary/50"
                                  }`}
                                >
                                  <div className="absolute inset-0 flex flex-col items-center justify-center p-1 sm:p-2">
                                    <span className="text-[10px] sm:text-xs font-medium text-center line-clamp-1 sm:line-clamp-2 break-words w-full px-0.5">
                                      {model.label}
                                    </span>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                      <div>
                          <Controller
                            name="model"
                            control={form.control}
                            render={({ field }) => (
                              <Select 
                                onValueChange={handleModelChange} 
                                value={field.value}
                                disabled={!selectedBrand}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a model" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedBrand && modelsList[selectedBrand as keyof typeof modelsList]?.map((model: any) => (
                                    <SelectItem key={model.slug} value={model.slug}>
                                      {model.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          <FormError error={form.formState.errors.model?.message} isSubmitted={isStepSubmitted} />
                        </div>

                        <div className="space-y-2">
                              <Label htmlFor="reference">Reference number</Label>
                              <Input
                                type="text"
                                id="reference"
                                maxLength={250}
                                {...form.register("reference")}
                              />
                              <p className="text-sm text-muted-foreground">
                                {form.watch("reference")?.length || 0} / 250
                              </p>
                              <FormError error={form.formState.errors.reference?.message} isSubmitted={isStepSubmitted} />
                            </div>
    
                      {/* Listing title */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Listing title</h3>
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Input 
                            id="title" 
                            placeholder="Complete the listing title" 
                            maxLength={40}
                            {...form.register("title")}
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            {form.watch("title")?.length || 0} / 40
                          </p>
                          <FormError error={form.formState.errors.title?.message} isSubmitted={isStepSubmitted} />
                        </div>
                      </div>

                      {/* Description - For all types */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          type="text"
                          id="description"
                          maxLength={250}
                          {...form.register("description")}
                        />
                        <p className="text-sm text-muted-foreground">
                          {form.watch("description")?.length || 0} / 250
                        </p>
                      </div>

                      {/* Additional details - Toggle Section */}
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setShowDetails(!showDetails)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <h3 className="text-lg font-semibold">More information (optional)</h3>
                          {showDetails ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        {showDetails && (
                          <div className="space-y-4 pt-4">
                            {/* Year - Always shown */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor="year">Manufacturing year</Label>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="yearUnknown"
                                    checked={form.watch("yearUnknown")}
                                    onCheckedChange={(checked) => {
                                      form.setValue("yearUnknown", checked as boolean)
                                      if (checked) {
                                        form.setValue("year", "")
                                      }
                                    }}
                                  />
                                  <Label htmlFor="yearUnknown" className="text-sm">Unknown year</Label>
                                </div>
                              </div>
                              {!form.watch("yearUnknown") && (
                                <Input
                                  type="number"
                                  id="year"
                                  placeholder="e.g. 2013"
                                  {...form.register("year")}
                                />
                              )}
                            </div>

                            {/* Specific fields based on accessory type */}
                            {selectedType && (
                              <div className="space-y-4">
                                {/* Fields specific to Dials */}
                                {selectedType === "Dial" && (
                                  <>
                                    <div className="space-y-2">
                                      <Label htmlFor="dialColor">Dial color</Label>
                                      <Select
                                        value={form.watch("dialColor")}
                                        onValueChange={(value) => form.setValue("dialColor", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a color" />
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
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="dimensions.width">Diameter</Label>
                                        <Input
                                          type="number"
                                          id="dimensions.width"
                                          placeholder="mm"
                                          {...form.register("dimensions.width")}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="dimensions.height">Thickness</Label>
                                        <Input
                                          type="number"
                                          id="dimensions.height"
                                          placeholder="mm"
                                          {...form.register("dimensions.height")}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Fields specific to Bezels */}
                                {selectedType === "Bezel" && (
                                  <>
                                    <div className="space-y-2">
                                      <Label htmlFor="lensMaterial">Bezel material</Label>
                                      <Select
                                        value={form.watch("lensMaterial")}
                                        onValueChange={(value) => form.setValue("lensMaterial", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a material" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {lensMaterials.map((material) => (
                                            <SelectItem key={material} value={material}>
                                              {material}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="dimensions.width">Diameter</Label>
                                        <Input
                                          type="number"
                                          id="dimensions.width"
                                          placeholder="mm"
                                          {...form.register("dimensions.width")}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="dimensions.height">Thickness</Label>
                                        <Input
                                          type="number"
                                          id="dimensions.height"
                                          placeholder="mm"
                                          {...form.register("dimensions.height")}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}

                                {/* Fields specific to Movements (complete) */}
                                {selectedType === "Movement (complete)" && (
                                  <>
                                    <div className="space-y-2">
                                      <Label htmlFor="movement">Movement</Label>
                                      <Select
                                        value={form.watch("movement")}
                                        onValueChange={(value) => form.setValue("movement", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a movement" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {movements.map((movement) => (
                                            <SelectItem key={movement} value={movement}>
                                              {movement}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="caliber">Caliber/Gears</Label>
                                      <Input
                                        type="text"
                                        id="caliber"
                                        maxLength={100}
                                        {...form.register("caliber")}
                                      />
                                      <p className="text-sm text-muted-foreground">
                                        {form.watch("caliber")?.length || 0} / 100
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="baseCaliber">Base Caliber</Label>
                                      <Input
                                        type="text"
                                        id="baseCaliber"
                                        maxLength={100}
                                        {...form.register("baseCaliber")}
                                      />
                                      <p className="text-sm text-muted-foreground">
                                        {form.watch("baseCaliber")?.length || 0} / 100
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="powerReserve">Power reserve</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          id="powerReserve"
                                          {...form.register("powerReserve")}
                                        />
                                        <span className="flex items-center">h</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="frequency">Oscillating movement</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          id="frequencyValue"
                                          {...form.register("frequencyValue")}
                                        />
                                        <Select
                                          value={form.watch("frequencyUnit")}
                                          onValueChange={(value) => form.setValue("frequencyUnit", value)}
                                        >
                                          <SelectTrigger className="w-[100px]">
                                            <SelectValue placeholder="Unit" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {frequencyUnits.map((unit) => (
                                              <SelectItem key={unit} value={unit}>
                                                {unit}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="jewels">Number of jewels</Label>
                                      <Input
                                        type="number"
                                        id="jewels"
                                        {...form.register("jewels")}
                                      />
                                    </div>
                                  </>
                                )}

                                {/* Fields specific to Movements (parts) */}
                                {selectedType === "Movement (parts)" && (
                                  <>
                                    <div className="space-y-2">
                                      <Label htmlFor="movement">Movement</Label>
                                      <Select
                                        value={form.watch("movement")}
                                        onValueChange={(value) => form.setValue("movement", value)}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a movement" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {movements.map((movement) => (
                                            <SelectItem key={movement} value={movement}>
                                              {movement}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="caliber">Caliber/Gears</Label>
                                      <Input
                                        type="text"
                                        id="caliber"
                                        maxLength={100}
                                        {...form.register("caliber")}
                                      />
                                      <p className="text-sm text-muted-foreground">
                                        {form.watch("caliber")?.length || 0} / 100
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="baseCaliber">Base Caliber</Label>
                                      <Input
                                        type="text"
                                        id="baseCaliber"
                                        maxLength={100}
                                        {...form.register("baseCaliber")}
                                      />
                                      <p className="text-sm text-muted-foreground">
                                        {form.watch("baseCaliber")?.length || 0} / 100
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="powerReserve">Power Reserve</Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="number"
                                          id="powerReserve"
                                          {...form.register("powerReserve")}
                                        />
                                        <span className="flex items-center">h</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="jewels">Number of jewels</Label>
                                      <Input
                                        type="number"
                                        id="jewels"
                                        {...form.register("jewels")}
                                      />
                                    </div>
                                  </>
                                )}

                                {/* Fields specific to Glass */}
                                {selectedType === "Glass" && (
                                  <div className="space-y-2">
                                    <Label htmlFor="glassType">Glass type</Label>
                                    <Select
                                      value={form.watch("glassType")}
                                      onValueChange={(value) => form.setValue("glassType", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a glass type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {glassTypes.map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Accessory condition</h3>
                      <FormError error={form.formState.errors.condition?.message} isSubmitted={isStepSubmitted} />
                      <div className="grid gap-4">
                        <Card
                          className={`cursor-pointer transition-colors ${
                            form.watch("condition") === "new"
                              ? "border-primary"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => {
                            form.setValue("condition", "new", { shouldValidate: true })
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-5 h-5 p-0.5 rounded-full border-2 flex items-center justify-center ${
                                  form.watch("condition") === "new"
                                    ? "border-primary bg-primary"
                                    : "border-input"
                                }`}
                              >
                                {form.watch("condition") === "new" && (
                                  <div className="w-full h-full rounded-full bg-primary-foreground" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">New - Never worn</h4>
                                <p className="text-sm text-muted-foreground">
                                  The accessory is in its original condition, never used
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card
                          className={`cursor-pointer transition-colors ${
                            form.watch("condition") === "used"
                              ? "border-primary"
                              : "hover:border-primary/50"
                          }`}
                          onClick={() => {
                            form.setValue("condition", "used", { shouldValidate: true })
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-5 h-5 p-0.5 rounded-full border-2 flex items-center justify-center ${
                                  form.watch("condition") === "used"
                                    ? "border-primary bg-primary"
                                    : "border-input"
                                }`}
                              >
                                {form.watch("condition") === "used" && (
                                  <div className="w-full h-full rounded-full bg-primary-foreground" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">Used</h4>
                                <p className="text-sm text-muted-foreground">
                                  The accessory has been used but is in good condition
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Accessory photos</h3>
                      <FormError error={form.formState.errors.images?.message} isSubmitted={isStepSubmitted} />
                      <p className="text-sm text-muted-foreground mb-4">
                        Add up to 10 photos of your accessory. Accepted formats: JPG, PNG, WEBP. Maximum size: 5MB per photo.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-square">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center hover:bg-background"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        
                        {imagePreviews.length < 10 && (
                          <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="hidden"
                              onChange={handleImageChange}
                              multiple
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Set your selling price</h3>                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="price">Selling price *</Label>
                          <div className="flex gap-4">
                            <Input
                              id="price"
                              type="number"
                              placeholder="0"
                              {...form.register("price", { valueAsNumber: true })}
                            />
                            <Controller
                              name="currency"
                              control={form.control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger className="w-[100px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                            <FormError error={form.formState.errors.price?.message} isSubmitted={isStepSubmitted} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="shippingDelay">Shipping delay *</Label>
                          <Select
                            value={form.watch("shippingDelay")}
                            onValueChange={(value) => form.setValue("shippingDelay", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a shipping delay" />
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
                          <FormError error={form.formState.errors.shippingDelay?.message} isSubmitted={isStepSubmitted} />
                        </div>

                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Selling price</span>
                                <span className="font-medium">
                                  {form.watch("price")?.toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Sales commission (0.5%)</span>
                                <span className="font-medium">
                                  {(form.watch("price") * 0.065).toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="font-medium">Estimated earnings</span>
                                <span className="font-medium text-primary">
                                  {(form.watch("price") * 0.935).toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Important documents</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add important documents such as invoices, certificates of authenticity, etc. These documents will only be visible to the final buyer after transaction validation.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {form.watch("documents")?.map((doc, index) => (
                          <div key={index} className="relative aspect-square">
                            <div className="w-full h-full border rounded-lg p-4 flex flex-col items-center justify-center">
                              <p className="text-sm font-medium truncate w-full text-center">
                                {doc.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <button
                                type="button"
                                onClick={() => {
                                  const newDocs = form.watch("documents")?.filter((_, i) => i !== index) || []
                                  form.setValue("documents", newDocs)
                                }}
                                className="absolute top-2 right-2 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center hover:bg-background"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                          <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || [])
                              const validFiles = files.filter(file => {
                                if (file.size > 5 * 1024 * 1024) {
                                  alert(`File ${file.name} is too large. Maximum size: 5MB`)
                                  return false
                                }
                                if (![".pdf", ".jpg", ".jpeg", ".png"].some(ext => file.name.toLowerCase().endsWith(ext))) {
                                  alert(`File ${file.name} is not an accepted format. Accepted formats: PDF, JPG, PNG`)
                                  return false
                                }
                                return true
                              })
                              form.setValue("documents", [...(form.watch("documents") || []), ...validFiles])
                            }}
                            multiple
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-6">
                    {step > 1 && (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Back
                      </Button>
                    )}
                    {step < 5 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Validating..." : "Continue"}
                      </Button>
                    ) : (
                      <Button 
                        type="button"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Publishing..." : "Publish listing"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-8">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
                      {imagePreviews.length > 0 ? (
                        <img
                          src={imagePreviews[currentImage]}
                          alt={`Preview ${currentImage + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-muted-foreground">Accessory image</p>
                        </div>
                      )}
                      
                      {imagePreviews.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImage(prev => prev === 0 ? imagePreviews.length - 1 : prev - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setCurrentImage(prev => prev === imagePreviews.length - 1 ? 0 : prev + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {imagePreviews.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImage(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  currentImage === index ? "bg-white" : "bg-white/50"
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium truncate" title={form.watch("title") || "Listing title"}>
                      {form.watch("title") || "Listing title"}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2" title={form.watch("description") || "Accessory description..."}>
                      {form.watch("description") || "Accessory description..."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Brand</p>
                      <p className="font-medium">
                        {brandsList.find(b => b.slug === form.watch("brand"))?.label || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Model</p>
                      <p className="font-medium">
                        {selectedBrand && modelsList[selectedBrand as keyof typeof modelsList]?.find((m: any) => m.slug === form.watch("model"))?.label || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Condition</p>
                      <p className="font-medium">
                        {form.watch("condition") === "new" ? "New" : form.watch("condition") === "used" ? "Used" : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Shipping delay</p>
                      <p className="font-medium">
                        {form.watch("shippingDelay") ? `${form.watch("shippingDelay")} business days` : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-semibold text-lg">
                        {form.watch("price") ? `${form.watch("price").toLocaleString()} ${form.watch("currency")}` : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
} 