"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from "@/components/ui/checkbox"
import watchProperties from "@/data/watch-properties.json"
import accessoryProperties from "@/data/accessory-properties.json"


// Schéma de validation pour le formulaire d'accessoire
const accessorySchema = z.object({
  // Champs communs
  type: z.string().min(1, "Le type d'accessoire est requis"),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modèle est requis"),
  year: z.string().optional(),
  yearUnknown: z.boolean().default(false),
  reference: z.string().optional(),
  description: z.string().optional(),
  condition: z.string().min(1, "L'état est requis"),
  images: z.array(z.instanceof(File)).min(1, "Au moins une photo est requise").max(10, "Maximum 10 photos"),
  price: z.number().min(1, "Le prix est requis"),
  currency: z.string().default("EUR"),
  shippingDelay: z.string().min(1, "Le délai d'envoi est requis"),
  documents: z.array(z.instanceof(File)).optional(),
  
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
  
  // Champs spécifiques aux accessoires
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

export default function SellAccessoryPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState("")
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [currentImage, setCurrentImage] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isStepSubmitted, setIsStepSubmitted] = useState(false)

  const form = useForm({
    resolver: zodResolver(accessorySchema),
    defaultValues: {
      type: "",
      brand: "",
      model: "",
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
    },
    mode: "onChange",
  })

  // Validation des étapes
  const validateStep = async (stepNumber: number) => {
    let fieldsToValidate: (keyof z.infer<typeof accessorySchema>)[] = []

    switch (stepNumber) {
      case 1:
        fieldsToValidate = ["type", "brand", "model"]
        if (selectedType === "Cadran") {
          fieldsToValidate.push("year", "reference", "dialColor", "dimensions")
        }
        break
      case 2:
        fieldsToValidate = ["condition"]
        break
      case 3:
        fieldsToValidate = ["images"]
        break
      case 4:
        fieldsToValidate = ["price"]
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validation des fichiers
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux. Taille maximum: 5MB`)
        return false
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
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
      console.log(data)
      // TODO: Submit form data
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push("/sell/success")
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Mettre en vente un accessoire
          </h1>
          <p className="text-muted-foreground text-lg">
            Complétez les informations ci-dessous pour créer votre annonce
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  stepNumber < 6 ? "flex-1" : ""
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
                {stepNumber < 6 && (
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
            <span className="w-8 text-center">État</span>
            <span className="w-8 text-center">Photos</span>
            <span className="w-8 text-center">Prix</span>
            <span className="w-8 text-center">Documents</span>
            <span className="w-8 text-center">Récap</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <div className="space-y-6">
                      {/* Type d'accessoire */}
                      <div className="space-y-2">
                        <Label htmlFor="type">Type d'accessoire *</Label>
                        <Select
                          value={selectedType}
                          onValueChange={handleTypeChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un type d'accessoire" />
                          </SelectTrigger>
                          <SelectContent>
                            {accessoryProperties.accessoryTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {isStepSubmitted && form.formState.errors.type && (
                          <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                        )}
                      </div>

                      {/* Marque et Modèle - Toujours affichés */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="brand">Marque *</Label>
                          <Select
                            value={form.watch("brand")}
                            onValueChange={(value) => form.setValue("brand", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez une marque" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* TODO: Ajouter les marques depuis l'API */}
                              <SelectItem value="rolex">Rolex</SelectItem>
                              <SelectItem value="omega">Omega</SelectItem>
                              <SelectItem value="patek">Patek Philippe</SelectItem>
                            </SelectContent>
                          </Select>
                          {isStepSubmitted && form.formState.errors.brand && (
                            <p className="text-sm text-red-500">{form.formState.errors.brand.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="model">Modèle *</Label>
                          <Select
                            value={form.watch("model")}
                            onValueChange={(value) => form.setValue("model", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un modèle" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* TODO: Ajouter les modèles en fonction de la marque sélectionnée */}
                              <SelectItem value="model1">Modèle 1</SelectItem>
                              <SelectItem value="model2">Modèle 2</SelectItem>
                            </SelectContent>
                          </Select>
                          {isStepSubmitted && form.formState.errors.model && (
                            <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Année - Toujours affichée */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="year">Année de fabrication</Label>
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
                            <Label htmlFor="yearUnknown" className="text-sm">Année inconnue</Label>
                          </div>
                        </div>
                        {!form.watch("yearUnknown") && (
                          <Input
                            type="number"
                            id="year"
                            placeholder="par ex. 2013"
                            {...form.register("year")}
                          />
                        )}
                        {isStepSubmitted && form.formState.errors.year && (
                          <p className="text-sm text-red-500">{form.formState.errors.year.message}</p>
                        )}
                      </div>

                      {/* Champs spécifiques en fonction du type d'accessoire */}
                      {selectedType && (
                        <div className="space-y-4">
                          {/* Numéro de référence - Pour tous sauf Aiguilles */}
                          {selectedType !== "Aiguilles" && (
                            <div className="space-y-2">
                              <Label htmlFor="reference">Numéro de référence</Label>
                              <Input
                                type="text"
                                id="reference"
                                maxLength={250}
                                {...form.register("reference")}
                              />
                              <p className="text-sm text-muted-foreground">
                                {form.watch("reference")?.length || 0} / 250
                              </p>
                            </div>
                          )}

                          {/* Description - Pour tous les types */}
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

                          {/* Champs spécifiques pour les Cadrans */}
                          {selectedType === "Cadran" && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="dialColor">Couleur du cadran</Label>
                                <Select
                                  value={form.watch("dialColor")}
                                  onValueChange={(value) => form.setValue("dialColor", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une couleur" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {watchProperties.dialColors.map((color) => (
                                      <SelectItem key={color} value={color}>
                                        {color}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="dimensions.width">Diamètre</Label>
                                  <Input
                                    type="number"
                                    id="dimensions.width"
                                    placeholder="mm"
                                    {...form.register("dimensions.width")}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="dimensions.height">Épaisseur</Label>
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

                          {/* Champs spécifiques pour les Couronnes/Poussoirs */}
                          {selectedType === "Couronne/Poussoir" && (
                            <div className="space-y-2">
                              <Label htmlFor="caliber">Calibre/Rouages</Label>
                              <Input
                                type="text"
                                id="caliber"
                                {...form.register("caliber")}
                              />
                            </div>
                          )}

                          {/* Champs spécifiques pour les Lunettes */}
                          {selectedType === "Lunette" && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="lensMaterial">Matériau de la lunette</Label>
                                <Select
                                  value={form.watch("lensMaterial")}
                                  onValueChange={(value) => form.setValue("lensMaterial", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un matériau" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {accessoryProperties.lensMaterials.map((material) => (
                                      <SelectItem key={material} value={material}>
                                        {material}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="dimensions.width">Diamètre</Label>
                                  <Input
                                    type="number"
                                    id="dimensions.width"
                                    placeholder="mm"
                                    {...form.register("dimensions.width")}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="dimensions.height">Épaisseur</Label>
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

                          {/* Champs spécifiques pour les Mouvements (complet) */}
                          {selectedType === "Mouvement (complet)" && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="movement">Mouvement</Label>
                                <Select
                                  value={form.watch("movement")}
                                  onValueChange={(value) => form.setValue("movement", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un mouvement" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {watchProperties.movements.map((movement) => (
                                      <SelectItem key={movement} value={movement}>
                                        {movement}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="caliber">Calibre/Rouages</Label>
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
                                <Label htmlFor="baseCaliber">Base Calibre</Label>
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
                                <Label htmlFor="powerReserve">Réserve de marche</Label>
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
                                <Label htmlFor="frequency">Mouvement oscillatoire</Label>
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
                                      <SelectValue placeholder="Unité" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {accessoryProperties.frequencyUnits.map((unit) => (
                                        <SelectItem key={unit} value={unit}>
                                          {unit}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="jewels">Nombre de pierres</Label>
                                <Input
                                  type="number"
                                  id="jewels"
                                  {...form.register("jewels")}
                                />
                              </div>
                            </>
                          )}

                          {/* Champs spécifiques pour les Mouvements (pièces) */}
                          {selectedType === "Mouvement (pièces)" && (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor="movement">Mouvement</Label>
                                <Select
                                  value={form.watch("movement")}
                                  onValueChange={(value) => form.setValue("movement", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un mouvement" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {watchProperties.movements.map((movement) => (
                                      <SelectItem key={movement} value={movement}>
                                        {movement}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="caliber">Calibre/Rouages</Label>
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
                                <Label htmlFor="baseCaliber">Base Calibre</Label>
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
                                <Label htmlFor="powerReserve">Réserve de marche</Label>
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
                                <Label htmlFor="jewels">Nombre de pierres</Label>
                                <Input
                                  type="number"
                                  id="jewels"
                                  {...form.register("jewels")}
                                />
                              </div>
                            </>
                          )}

                          {/* Champs spécifiques pour les Nettoyants, Outils et Remontoirs */}
                          {(selectedType === "Nettoyant" || selectedType === "Outils" || selectedType === "Remontoir de montres") && (
                            <div className="space-y-2">
                              <Label htmlFor="year">Année de fabrication</Label>
                              <Input
                                type="number"
                                id="year"
                                {...form.register("year")}
                              />
                            </div>
                          )}

                          {/* Champs spécifiques pour les Verres */}
                          {selectedType === "Verre" && (
                            <div className="space-y-2">
                              <Label htmlFor="glassType">Type de verre</Label>
                              <Select
                                value={form.watch("glassType")}
                                onValueChange={(value) => form.setValue("glassType", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Sélectionnez un type de verre" />
                                </SelectTrigger>
                                <SelectContent>
                                  {accessoryProperties.glassTypes.map((type) => (
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

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">État de l'accessoire</h3>
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
                                <h4 className="font-medium">Neuf - Jamais porté</h4>
                                <p className="text-sm text-muted-foreground">
                                  L'accessoire est dans son état d'origine, jamais utilisé
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
                                <h4 className="font-medium">D'occasion</h4>
                                <p className="text-sm text-muted-foreground">
                                  L'accessoire a été utilisé mais est en bon état
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
                      <h3 className="text-lg font-semibold">Photos de l'accessoire</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ajoutez jusqu'à 10 photos de votre accessoire. Formats acceptés : JPG, PNG, WEBP. Taille maximum : 5MB par photo.
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
                          {isStepSubmitted && form.formState.errors.shippingDelay && (
                            <p className="text-sm text-red-500">{form.formState.errors.shippingDelay.message}</p>
                          )}
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
                                  {(form.watch("price") * 0.065).toLocaleString()} {form.watch("currency")}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t">
                                <span className="font-medium">Estimation de votre gain</span>
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

                  {step === 6 && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Récapitulatif</h3>
                      
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Type d'accessoire</h4>
                                <p className="text-muted-foreground">{form.watch("type")}</p>
                              </div>

                              {selectedType === "Cadran" && (
                                <>
                                  <div>
                                    <h4 className="font-medium mb-2">Année de fabrication</h4>
                                    <p className="text-muted-foreground">
                                      {form.watch("yearUnknown") ? "Inconnue" : form.watch("year")}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Numéro de référence</h4>
                                    <p className="text-muted-foreground">{form.watch("reference")}</p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Couleur du cadran</h4>
                                    <p className="text-muted-foreground">{form.watch("dialColor")}</p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Dimensions</h4>
                                    <p className="text-muted-foreground">
                                      {form.watch("dimensions.width")} x {form.watch("dimensions.height")} mm
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Description</h4>
                                    <p className="text-muted-foreground">{form.watch("description")}</p>
                                  </div>
                                </>
                              )}

                              {selectedType === "Bracelet" && (
                                <>
                                  <div>
                                    <h4 className="font-medium mb-2">Année de fabrication</h4>
                                    <p className="text-muted-foreground">
                                      {form.watch("yearUnknown") ? "Inconnue" : form.watch("year")}
                                    </p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Numéro de référence</h4>
                                    <p className="text-muted-foreground">{form.watch("reference")}</p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Couleur du bracelet</h4>
                                    <p className="text-muted-foreground">{form.watch("braceletColor")}</p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Matière du bracelet</h4>
                                    <p className="text-muted-foreground">{form.watch("braceletMaterial")}</p>
                                  </div>

                                  <div>
                                    <h4 className="font-medium mb-2">Dimensions</h4>
                                    <div className="text-muted-foreground space-y-1">
                                      <p>Largeur entrecorne : {form.watch("dimensions.lugWidth")} mm</p>
                                      <p>Largeur boucle : {form.watch("dimensions.claspWidth")} mm</p>
                                      <p>Longueur côté long : {form.watch("dimensions.braceletLongLength")} mm</p>
                                      <p>Longueur côté court : {form.watch("dimensions.braceletShortLength")} mm</p>
                                      <p>Épaisseur : {form.watch("dimensions.braceletThickness")} mm</p>
                                    </div>
                                  </div>
                                </>
                              )}

                              <div>
                                <h4 className="font-medium mb-2">État</h4>
                                <p className="text-muted-foreground">
                                  {form.watch("condition") === "new" ? "Neuf - Jamais porté" : "D'occasion"}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Prix</h4>
                                <p className="text-muted-foreground">
                                  {form.watch("price")?.toLocaleString()} {form.watch("currency")}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Délai d'envoi</h4>
                                <p className="text-muted-foreground">
                                  {form.watch("shippingDelay")} jours ouvrés
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-6">
                    {step > 1 && (
                      <Button type="button" variant="outline" onClick={prevStep}>
                        Retour
                      </Button>
                    )}
                    {step < 6 ? (
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
                        onClick={form.handleSubmit(onSubmit)}
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
                        <img
                          src={imagePreviews[currentImage]}
                          alt={`Preview ${currentImage + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-muted-foreground">Image de l'accessoire</p>
                        </div>
                      )}
                      
                      {imagePreviews.length > 1 && (
                        <>
                          <button
                            onClick={() => setCurrentImage(prev => prev === 0 ? imagePreviews.length - 1 : prev - 1)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Image précédente"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setCurrentImage(prev => prev === imagePreviews.length - 1 ? 0 : prev + 1)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            aria-label="Image suivante"
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
                                aria-label={`Aller à l'image ${index + 1}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium truncate">
                      {form.watch("type") || "Type d'accessoire"}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {form.watch("description") || "Description de l'accessoire..."}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">
                        {form.watch("type") || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">État</p>
                      <p className="font-medium">
                        {form.watch("condition") === "new" ? "Neuf" : form.watch("condition") === "used" ? "D'occasion" : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Délai d'envoi</p>
                      <p className="font-medium">
                        {form.watch("shippingDelay") ? `${form.watch("shippingDelay")} jours ouvrés` : "-"}
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