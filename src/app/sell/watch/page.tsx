"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Upload, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { dialColors, movements, cases, braceletMaterials, braceletColors, includedOptions } from "@/data/watch-properties"
import { brandsList } from "@/data/brands-list"
import { modelsList } from "@/data/models-list"
import { watchConditions } from "@/data/watch-conditions"

// Add a component to display errors
const FormError = ({ error, isSubmitted }: { error?: string, isSubmitted: boolean }) => {
    if (!error || !isSubmitted) return null
    return <p className="text-sm text-red-500 mt-1">{error}</p>
}

// Validation schema for the sell form
const sellSchema = z.object({
  // Step 1: Basic Information
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  reference: z.string().min(1, "Reference number is required"),
  title: z.string().min(1, "Title is required").max(60, "Title must not exceed 60 characters"),
  description: z.string().optional(),
  year: z.string().min(1, "Year is required"),
  gender: z.string().optional(),
  serialNumber: z.string().optional(),
  dialColor: z.string().optional(),
  diameter: z.object({
    min: z.string().optional(),
    max: z.string().optional(),
  }),
  movement: z.string().optional(),
  case: z.string().optional(),
  braceletMaterial: z.string().optional(),
  braceletColor: z.string().optional(),
  listing_type: z.string().default("watch"),
  
  // Step 2: Delivery Contents
  included: z.string().min(1, "Please select delivery contents"),
  condition: z.string().min(1, "Please select watch condition"),
  
  // Step 3: Photos
  images: z.array(z.instanceof(File)).min(1, "At least one photo is required").max(10, "Maximum 10 photos"),
  
  // Step 4: Price
  price: z.number().min(1, "Price is required"),
  currency: z.string().default("EUR"),
  shippingDelay: z.string().min(1, "Shipping delay is required"),

  // Step 5: Documents
  documents: z.array(z.instanceof(File)).optional(),
})

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

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

export default function SellWatchPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedBrand, setSelectedBrand] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [previewTitle, setPreviewTitle] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImage, setCurrentImage] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStepSubmitted, setIsStepSubmitted] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const form = useForm({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      brand: "",
      model: "",
      reference: "",
      title: "",
      description: "",
      year: "",
      gender: "unisex",
      serialNumber: "",
      dialColor: "",
      diameter: {
        min: "",
        max: "",
      },
      movement: "",
      case: "",
      braceletMaterial: "",
      braceletColor: "",
      included: "",
      condition: "",
      images: [],
      price: 0,
      currency: "EUR",
      shippingDelay: "",
      documents: [] as File[],
      listing_type: "watch",
    },
    mode: "onChange",
  })

  // Update title preview when title changes
  useEffect(() => {
    setPreviewTitle(form.watch("title"))
  }, [form.watch("title")])

  // Auto-complete title when brand, model or reference changes
  useEffect(() => {
    const brand = brandsList.find(b => b.slug === form.watch("brand"))?.label
    const model = selectedBrand && modelsList[selectedBrand as keyof typeof modelsList]?.find((m: any) => m.slug === form.watch("model"))?.label
    const reference = form.watch("reference")

    if (brand && model && reference) {
      const suggestedTitle = `${brand} - ${model} - ${reference}`
      form.setValue("title", suggestedTitle)
    }
  }, [form.watch("brand"), form.watch("model"), form.watch("reference")])

  // Step validation
  const validateStep = async (stepNumber: number) => {
    let fieldsToValidate: (keyof z.infer<typeof sellSchema>)[] = []

    switch (stepNumber) {
      case 1:
        fieldsToValidate = [
          "brand",
          "model",
          "reference",
          "title",
        ]
        break
      case 2:
        fieldsToValidate = ["included", "condition"]
        break
      case 3:
        fieldsToValidate = ["images"]
        break
      case 4:
        fieldsToValidate = ["price"]
        break
      case 5:
        fieldsToValidate = ["documents"]
        break
    }

    const result = await form.trigger(fieldsToValidate)
    setIsStepSubmitted(true)
    return result
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
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Maximum size: 5MB`)
        return false
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
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
    form.setValue("images", [...selectedImages, ...validFiles] as never[])

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
    form.setValue("images", selectedImages.filter((_, i) => i !== index) as never[])
  }

  const calculateCommission = (price: number) => {
    return price * 0.005
  }

  const calculateGain = (price: number) => {
    return price - calculateCommission(price)
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

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage((prev) => (prev === imagePreviews.length - 1 ? 0 : prev + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImage((prev) => (prev === 0 ? imagePreviews.length - 1 : prev - 1))
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
        if (key === 'diameter') {
          formData.append('diameter', JSON.stringify(data[key]))
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const isValid = await validateStep(5)
    
    if (isValid) {
      const formData = form.getValues()
      await onSubmit(formData)
    }
    
    setIsSubmitting(false)
  }

  return (
    <main className="container py-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4">
            List a Watch for Sale
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Complete the information below to create your listing
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-4 sm:mb-8">
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
            <span className="w-8 text-center">Info</span>
            <span className="w-8 text-center">Content</span>
            <span className="w-8 text-center">Photos</span>
            <span className="w-8 text-center">Price</span>
            <span className="w-8 text-center">Docs</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <>
                      {/* Watch Selection */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Select your watch</h3>
                        
                        {/* Popular Brands */}
                        <div className="space-y-2">
                          <Label>Popular Brands</Label>
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
                        
                        <div className="space-y-2">
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
                          <FormError error={form.formState.errors.brand?.message as string} isSubmitted={isStepSubmitted} />
                        </div>

                        {/* Popular Models */}
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

                        <div className="space-y-2">
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
                          <FormError error={form.formState.errors.model?.message as string} isSubmitted={isStepSubmitted} />
                        </div>

                        <div>
                          <Label htmlFor="reference">Reference Number *</Label>
                          <Input 
                            id="reference" 
                            placeholder="e.g. 18038" 
                            {...form.register("reference")} 
                          />
                          <FormError error={form.formState.errors.reference?.message as string} isSubmitted={isStepSubmitted} />
                        </div>
                      </div>

                      {/* Listing Title */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Listing Title</h3>
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
                          <FormError error={form.formState.errors.title?.message as string} isSubmitted={isStepSubmitted} />
                        </div>

                        <div>
                          <Label htmlFor="description">Description (optional)</Label>
                          <Input 
                            id="description" 
                            placeholder="For example, complete set, special edition" 
                            maxLength={40}
                            {...form.register("description")}
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            {form.watch("description")?.length || 0} / 40
                          </p>
                          <FormError error={form.formState.errors.description?.message as string} isSubmitted={isStepSubmitted} />
                        </div>
                      </div>

                      {/* Watch Details - Toggle Section */}
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setShowDetails(!showDetails)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <h3 className="text-lg font-semibold">Watch Details (optional)</h3>
                          {showDetails ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        {showDetails && (
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="year">Manufacturing Year (optional)</Label>
                              <Input 
                                id="year" 
                                placeholder="e.g. 2013" 
                                {...form.register("year")}
                              />
                              <FormError error={form.formState.errors.year?.message as string} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="gender">Gender</Label>
                              <Controller
                                name="gender"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unisex">Men's Watch/Unisex</SelectItem>
                                      <SelectItem value="men">Men's Watch</SelectItem>
                                      <SelectItem value="women">Women's Watch</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              <FormError error={form.formState.errors.gender?.message as string} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="serialNumber">Serial Number (will not be published)</Label>
                              <Input 
                                id="serialNumber" 
                                placeholder="Serial Number" 
                                {...form.register("serialNumber")}
                              />
                            </div>

                            <div>
                              <Label htmlFor="dialColor">Dial Color (optional)</Label>
                              <Controller
                                name="dialColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {dialColors.map((color) => (
                                        <SelectItem key={color} value={color}>
                                          {color}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              <FormError error={form.formState.errors.dialColor?.message as string} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label>Diameter (optional)</Label>
                              <div className="flex items-center gap-2">
                                <Input 
                                  placeholder="Min" 
                                  {...form.register("diameter.min")}
                                />
                                <span className="text-muted-foreground">x</span>
                                <Input 
                                  placeholder="Max" 
                                  {...form.register("diameter.max")}
                                />
                                <span className="text-muted-foreground">mm</span>
                              </div>
                              <FormError error={form.formState.errors.diameter?.min?.message as string || form.formState.errors.diameter?.max?.message as string} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="movement">Movement (optional)</Label>
                              <Controller
                                name="movement"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {movements.map((movement) => (
                                        <SelectItem key={movement} value={movement}>
                                          {movement}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              <FormError error={form.formState.errors.movement?.message as string} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="case">Case (optional)</Label>
                              <Controller
                                name="case"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {cases.map((case_) => (
                                        <SelectItem key={case_} value={case_}>
                                          {case_}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              <FormError error={form.formState.errors.case?.message as string} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="braceletMaterial">Bracelet Material (optional)</Label>
                              <Controller
                                name="braceletMaterial"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {braceletMaterials.map((material) => (
                                        <SelectItem key={material} value={material}>
                                          {material}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              <FormError error={form.formState.errors.braceletMaterial?.message as string} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="braceletColor">Bracelet Color (optional)</Label>
                              <Controller
                                name="braceletColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {braceletColors.map((color) => (
                                        <SelectItem key={color} value={color}>
                                          {color}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              <FormError error={form.formState.errors.braceletColor?.message as string} isSubmitted={isStepSubmitted} />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Delivery Contents</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select what will be included with the watch *
                        </p>
                        <FormError error={form.formState.errors.included?.message as string} isSubmitted={isStepSubmitted} />
                        <div className="grid gap-4">
                          {includedOptions.map((option) => (
                            <Card
                              key={option.id}
                              className={`cursor-pointer transition-colors ${
                                form.watch("included") === option.id
                                  ? "border-primary"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => {
                                form.setValue("included", option.id, { shouldValidate: true })
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-5 h-5 p-0.5 rounded-full border-2 flex items-center justify-center ${
                                      form.watch("included") === option.id
                                        ? "border-primary bg-primary"
                                        : "border-input"
                                    }`}
                                  >
                                    {form.watch("included") === option.id && (
                                      <div className="w-full h-full rounded-full bg-primary-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{option.title}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Watch Condition</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Select the condition of your watch *
                        </p>
                        <FormError error={form.formState.errors.condition?.message as string} isSubmitted={isStepSubmitted} />
                        <div className="grid gap-4">
                          {watchConditions.map((condition) => (
                            <Card
                              key={condition.slug}
                              className={`cursor-pointer transition-colors ${
                                form.watch("condition") === condition.slug
                                  ? "border-primary"
                                  : "hover:border-primary/50"
                              }`}
                              onClick={() => {
                                form.setValue("condition", condition.slug, { shouldValidate: true })
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`w-5 h-5 p-0.5 rounded-full border-2 flex items-center justify-center ${
                                      form.watch("condition") === condition.slug
                                        ? "border-primary bg-primary"
                                        : "border-input"
                                    }`}
                                  >
                                    {form.watch("condition") === condition.slug && (
                                      <div className="w-full h-full rounded-full bg-primary-foreground" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{condition.label}</h4>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Watch Photos</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add up to 10 photos of your watch. Accepted formats: JPG, PNG, WEBP. Maximum size: 5MB per photo.
                      </p>

                      <FormError error={form.formState.errors.images?.message as string} isSubmitted={isStepSubmitted} />
                      
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
                      <h3 className="text-lg font-semibold">Set Your Sale Price</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="price">Sale Price *</Label>
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
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="shippingDelay">Shipping Time *</Label>
                          <Select
                            value={form.watch("shippingDelay")}
                            onValueChange={(value) => form.setValue("shippingDelay", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select shipping time" />
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
                          <FormError error={form.formState.errors.shippingDelay?.message as string} isSubmitted={isStepSubmitted} />
                        </div>

                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Sale price</span>
                                <span className="font-medium">
                                  {form.watch("price")?.toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Sales commission (0.5%)</span>
                                <span className="font-medium">
                                  {calculateCommission(form.watch("price") || 0).toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="font-medium">Estimated earnings</span>
                                <span className="font-medium text-primary">
                                  {calculateGain(form.watch("price") || 0).toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <FormError error={form.formState.errors.price?.message as string} isSubmitted={isStepSubmitted} />
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Important Documents</h3>
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
                        onClick={handleSubmit}
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
                        <Image
                          src={imagePreviews[currentImage]}
                          alt={`Preview ${currentImage + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-muted-foreground">Watch image</p>
                        </div>
                      )}
                      
                      {/* Navigation Buttons - Only show if there are multiple images */}
                      {imagePreviews.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>

                          {/* Dots Navigation */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {imagePreviews.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setCurrentImage(index)
                                }}
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
                    <h4 className="font-medium truncate" title={previewTitle || "Listing title"}>
                      {previewTitle || "Listing title"}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2" title={form.watch("description") || "Watch description..."}>
                      {form.watch("description") || "Watch description..."}
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
                      <p className="text-muted-foreground">Reference</p>
                      <p className="font-medium truncate" title={form.watch("reference") || "-"}>
                        {form.watch("reference") || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Year</p>
                      <p className="font-medium truncate" title={form.watch("year") || "-"}>
                        {form.watch("year") || "-"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Shipping time</p>
                      <p className="font-medium">
                        {form.watch("shippingDelay") ? `${form.watch("shippingDelay")} business days` : "-"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Condition</p>
                      <p className="font-medium">
                        {watchConditions.find(c => c.slug === form.watch("condition"))?.label || "-"}
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