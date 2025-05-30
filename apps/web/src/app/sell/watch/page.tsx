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

// Ajouter un composant pour afficher les erreurs
const FormError = ({ error, isSubmitted }: { error?: string, isSubmitted: boolean }) => {
    if (!error || !isSubmitted) return null
    return <p className="text-sm text-red-500 mt-1">{error}</p>
}

// Schéma de validation pour le formulaire de vente
const sellSchema = z.object({
  // Step 1: Informations de base
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  reference: z.string().min(1, "Le numéro de référence est requis"),
  title: z.string().min(1, "Le titre est requis").max(60, "Le titre ne doit pas dépasser 60 caractères"),
  description: z.string().optional(),
  year: z.string().min(1, "L'année est requise"),
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
  
  // Step 2: Contenu de la livraison
  included: z.string().min(1, "Veuillez sélectionner le contenu de la livraison"),
  condition: z.string().min(1, "Veuillez sélectionner l'état de la montre"),
  
  // Step 3: Photos
  images: z.array(z.instanceof(File)).min(1, "Au moins une photo est requise").max(10, "Maximum 10 photos"),
  
  // Step 4: Prix
  price: z.number().min(1, "Le prix est requis"),
  currency: z.string().default("EUR"),
  shippingDelay: z.string().min(1, "Le délai d'envoi est requis"),

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
      documents: [],
    },
    mode: "onChange",
  })

  // Mettre à jour l'aperçu du titre quand le titre change
  useEffect(() => {
    setPreviewTitle(form.watch("title"))
  }, [form.watch("title")])

  // Auto-compléter le titre quand la marque, le modèle ou la référence change
  useEffect(() => {
    const brand = brandsList.find(b => b.slug === form.watch("brand"))?.label
    const model = selectedBrand && modelsList[selectedBrand as keyof typeof modelsList]?.find((m: any) => m.slug === form.watch("model"))?.label
    const reference = form.watch("reference")

    if (brand && model && reference) {
      const suggestedTitle = `${brand} - ${model} - ${reference}`
      form.setValue("title", suggestedTitle)
    }
  }, [form.watch("brand"), form.watch("model"), form.watch("reference")])

  // Validation des étapes
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
    
    // Validation des fichiers
    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`Le fichier ${file.name} est trop volumineux. Taille maximum: 5MB`)
        return false
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        alert(`Le fichier ${file.name} n'est pas un format d'image accepté. Formats acceptés: JPG, PNG, WEBP`)
        return false
      }
      return true
    })

    if (validFiles.length + selectedImages.length > 10) {
      alert("Vous ne pouvez pas ajouter plus de 10 images")
      return
    }

    setSelectedImages(prev => [...prev, ...validFiles])
    form.setValue("images", [...selectedImages, ...validFiles])

    // Création des previews
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

  const calculateCommission = (price: number) => {
    return price * 0.065
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
      console.log(data)
      // TODO: Submit form data
      // Simuler un délai de soumission
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/sell/success")
    } catch (error) {
      console.error(error)
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
            Mettre en vente une montre
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Complétez les informations ci-dessous pour créer votre annonce
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
            <span className="w-8 text-center">Infos</span>
            <span className="w-8 text-center">Contenu</span>
            <span className="w-8 text-center">Photos</span>
            <span className="w-8 text-center">Prix</span>
            <span className="w-8 text-center">Documents</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <>
                      {/* Sélection de la montre */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Sélectionnez votre montre</h3>
                        
                        {/* Marques populaires */}
                        <div className="space-y-2">
                          <Label>Marques populaires</Label>
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
                                  <SelectValue placeholder="Sélectionnez une marque" />
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

                        {/* Modèles populaires */}
                        {selectedBrand && modelsList[selectedBrand as keyof typeof modelsList] && (
                          <div className="space-y-2">
                            <Label>Modèles {brandsList.find(b => b.slug === selectedBrand)?.label}</Label>
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
                                  <SelectValue placeholder="Sélectionnez un modèle" />
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

                        <div>
                          <Label htmlFor="reference">Numéro de référence *</Label>
                          <Input 
                            id="reference" 
                            placeholder="ex: 18038" 
                            {...form.register("reference")} 
                          />
                          <FormError error={form.formState.errors.reference?.message} isSubmitted={isStepSubmitted} />
                        </div>
                      </div>

                      {/* Titre de l'annonce */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Titre de l'annonce</h3>
                        <div>
                          <Label htmlFor="title">Titre *</Label>
                          <Input 
                            id="title" 
                            placeholder="Complétez le titre de l'annonce" 
                            maxLength={40}
                            {...form.register("title")}
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            {form.watch("title")?.length || 0} / 40
                          </p>
                          <FormError error={form.formState.errors.title?.message} isSubmitted={isStepSubmitted} />
                        </div>

                        <div>
                          <Label htmlFor="description">Description (facultatif)</Label>
                          <Input 
                            id="description" 
                            placeholder="Par exemple, set complet, édition spéciale" 
                            maxLength={40}
                            {...form.register("description")}
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            {form.watch("description")?.length || 0} / 40
                          </p>
                          <FormError error={form.formState.errors.description?.message} isSubmitted={isStepSubmitted} />
                        </div>
                      </div>

                      {/* Détails de la montre - Toggle Section */}
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setShowDetails(!showDetails)}
                          className="flex items-center justify-between w-full text-left"
                        >
                          <h3 className="text-lg font-semibold">Détails de la montre (facultatif)</h3>
                          {showDetails ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>

                        {showDetails && (
                          <div className="space-y-4 pt-4">
                            <div>
                              <Label htmlFor="year">Année de fabrication (facultatif)</Label>
                              <Input 
                                id="year" 
                                placeholder="ex: 2013" 
                                {...form.register("year")}
                              />
                              <FormError error={form.formState.errors.year?.message} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="gender">Genre</Label>
                              <Controller
                                name="gender"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unisex">Montre homme/Unisexe</SelectItem>
                                      <SelectItem value="men">Montre homme</SelectItem>
                                      <SelectItem value="women">Montre femme</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              <FormError error={form.formState.errors.gender?.message} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="serialNumber">Numéro de série (ne sera pas publié)</Label>
                              <Input 
                                id="serialNumber" 
                                placeholder="Numéro de série" 
                                {...form.register("serialNumber")}
                              />
                            </div>

                            <div>
                              <Label htmlFor="dialColor">Couleur du cadran (facultatif)</Label>
                              <Controller
                                name="dialColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez" />
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
                              <FormError error={form.formState.errors.dialColor?.message} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label>Diamètre (facultatif)</Label>
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
                              <FormError error={form.formState.errors.diameter?.min?.message || form.formState.errors.diameter?.max?.message} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="movement">Mouvement (facultatif)</Label>
                              <Controller
                                name="movement"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez" />
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
                              <FormError error={form.formState.errors.movement?.message} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="case">Boîtier (facultatif)</Label>
                              <Controller
                                name="case"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez" />
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
                              <FormError error={form.formState.errors.case?.message} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="braceletMaterial">Matière du bracelet (facultatif)</Label>
                              <Controller
                                name="braceletMaterial"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez" />
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
                              <FormError error={form.formState.errors.braceletMaterial?.message} isSubmitted={isStepSubmitted} />
                            </div>

                            <div>
                              <Label htmlFor="braceletColor">Couleur du bracelet (facultatif)</Label>
                              <Controller
                                name="braceletColor"
                                control={form.control}
                                render={({ field }) => (
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez" />
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
                              <FormError error={form.formState.errors.braceletColor?.message} isSubmitted={isStepSubmitted} />
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contenu de la livraison</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Sélectionnez ce qui sera inclus avec la montre *
                        </p>
                        <FormError error={form.formState.errors.included?.message} isSubmitted={isStepSubmitted} />
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
                        <h3 className="text-lg font-semibold">État de la montre</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Sélectionnez l'état de votre montre *
                        </p>
                        <FormError error={form.formState.errors.condition?.message} isSubmitted={isStepSubmitted} />
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
                      <h3 className="text-lg font-semibold">Photos de la montre</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ajoutez jusqu'à 10 photos de votre montre. Formats acceptés : JPG, PNG, WEBP. Taille maximum : 5MB par photo.
                      </p>

                      <FormError error={form.formState.errors.images?.message} isSubmitted={isStepSubmitted} />
                      
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
                      <h3 className="text-lg font-semibold">Déterminez votre prix de vente</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="price">Prix de vente *</Label>
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
                          <Label htmlFor="shippingDelay">Délai d'envoi *</Label>
                          <Select
                            value={form.watch("shippingDelay")}
                            onValueChange={(value) => form.setValue("shippingDelay", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un délai d'envoi" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-2">1-2 jours ouvrés</SelectItem>
                              <SelectItem value="2-3">2-3 jours ouvrés</SelectItem>
                              <SelectItem value="3-5">3-5 jours ouvrés</SelectItem>
                              <SelectItem value="5-7">5-7 jours ouvrés</SelectItem>
                              <SelectItem value="7-10">7-10 jours ouvrés</SelectItem>
                              <SelectItem value="10+">Plus de 10 jours ouvrés</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormError error={form.formState.errors.shippingDelay?.message} isSubmitted={isStepSubmitted} />
                        </div>

                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Prix de vente</span>
                                <span className="font-medium">
                                  {form.watch("price")?.toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Commission de vente (6,5 %)</span>
                                <span className="font-medium">
                                  {calculateCommission(form.watch("price") || 0).toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="font-medium">Estimation de votre gain</span>
                                <span className="font-medium text-primary">
                                  {calculateGain(form.watch("price") || 0).toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Notre recommandation</h4>
                            <p className="text-sm text-muted-foreground">
                              Des montres similaires sont proposées et vendues entre 14 612 € et 25 062 €.
                              <button className="text-primary hover:underline ml-1">
                                En savoir plus
                              </button>
                            </p>
                          </CardContent>
                        </Card>
                        <FormError error={form.formState.errors.price?.message} isSubmitted={isStepSubmitted} />
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Documents importants</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ajoutez des documents importants comme des factures, certificats d'authenticité, etc. Ces documents ne seront visibles que par l'acheteur final après la validation de la transaction.
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
                                  alert(`Le fichier ${file.name} est trop volumineux. Taille maximum: 5MB`)
                                  return false
                                }
                                if (![".pdf", ".jpg", ".jpeg", ".png"].some(ext => file.name.toLowerCase().endsWith(ext))) {
                                  alert(`Le fichier ${file.name} n'est pas un format accepté. Formats acceptés: PDF, JPG, PNG`)
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
                        Retour
                      </Button>
                    )}
                    {step < 5 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Validation..." : "Continuer"}
                      </Button>
                    ) : (
                      <Button 
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Publication..." : "Publier l'annonce"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Aperçu */}
          <div className="space-y-8">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
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
                          <p className="text-muted-foreground">Image de la montre</p>
                        </div>
                      )}
                      
                      {/* Navigation Buttons - Only show if there are multiple images */}
                      {imagePreviews.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Image précédente"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Image suivante"
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
                                aria-label={`Aller à l'image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium truncate" title={previewTitle || "Titre de l'annonce"}>
                      {previewTitle || "Titre de l'annonce"}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2" title={form.watch("description") || "Description de la montre..."}>
                      {form.watch("description") || "Description de la montre..."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Marque</p>
                      <p className="font-medium">
                        {brandsList.find(b => b.slug === form.watch("brand"))?.label || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Modèle</p>
                      <p className="font-medium">
                        {selectedBrand && modelsList[selectedBrand as keyof typeof modelsList]?.find((m: any) => m.slug === form.watch("model"))?.label || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Référence</p>
                      <p className="font-medium truncate" title={form.watch("reference") || "-"}>
                        {form.watch("reference") || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Année</p>
                      <p className="font-medium truncate" title={form.watch("year") || "-"}>
                        {form.watch("year") || "-"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">Délai d'envoi</p>
                      <p className="font-medium">
                        {form.watch("shippingDelay") ? `${form.watch("shippingDelay")} jours ouvrés` : "-"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">État</p>
                      <p className="font-medium">
                        {watchConditions.find(c => c.slug === form.watch("condition"))?.label || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground">Prix</p>
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