"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Mail, Phone, MessageSquare } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { countries } from "@/data/form-options"
import { ActiveSearchInsert } from "@/types/db/ActiveSearches"
import { useBrandsAndModels } from "@/hooks/useBrandsAndModels"

const activeSearchSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(255, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description too long"),
  type: z.enum(["watch", "accessory"]),
  brand_id: z.string().optional(),
  model_id: z.string().optional(),
  reference: z.string().optional(),
  dial_color: z.string().optional(),
  max_price: z.string().optional(),
  location: z.string().optional(),
  accessory_type: z.string().optional(),
  is_public: z.boolean().default(true),
  contact_preferences: z.object({
    email: z.boolean().default(true),
    phone: z.boolean().default(false),
    whatsapp: z.boolean().default(false)
  }).refine(data => data.email || data.phone || data.whatsapp, {
    message: "At least one contact method must be selected"
  })
})

type FormData = z.infer<typeof activeSearchSchema>

interface Props {
  onSubmit: (data: Omit<ActiveSearchInsert, "user_id" | "is_active">) => Promise<void>
  isSubmitting?: boolean
  initialData?: Partial<ActiveSearchInsert>
}

const FormError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-red-500 mt-1">{message}</p> : null

export default function ActiveSearchForm({ onSubmit, isSubmitting = false, initialData }: Props) {
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedBrandId, setSelectedBrandId] = useState<string>("")
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true)
  const [contactPrefs, setContactPrefs] = useState({
    email: initialData?.contact_preferences?.email ?? true,
    phone: initialData?.contact_preferences?.phone ?? false,
    whatsapp: initialData?.contact_preferences?.whatsapp ?? false
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(activeSearchSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      type: initialData?.type || "watch",
      brand_id: initialData?.brand_id || "",
      model_id: initialData?.model_id || "",
      reference: initialData?.reference || "",
      dial_color: initialData?.dial_color || "",
      max_price: initialData?.max_price !== undefined && initialData?.max_price !== null ? String(initialData.max_price) : "",
      location: initialData?.location || "",
      accessory_type: initialData?.accessory_type || "",
      is_public: initialData?.is_public ?? true,
      contact_preferences: {
        email: initialData?.contact_preferences?.email ?? true,
        phone: initialData?.contact_preferences?.phone ?? false,
        whatsapp: initialData?.contact_preferences?.whatsapp ?? false
      }
    }
  })

  const watchType = watch("type")

  const { brands, models, isLoading: isLoadingBrands, fetchModels } = useBrandsAndModels()

  useEffect(() => {
    if (selectedBrand) {
      const brandObj = brands.find(b => b.slug === selectedBrand)
      if (brandObj) {
        setValue("brand_id", brandObj.id)
        setValue("model_id", "")
        setSelectedBrandId(brandObj.id)
        fetchModels(brandObj.id)
      } else {
        setSelectedBrandId("")
      }
    } else {
      setSelectedBrandId("")
    }
  }, [selectedBrand, setValue, brands, fetchModels])

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value)
  }

  const handleContactPrefChange = (method: keyof typeof contactPrefs, value: boolean) => {
    const newPrefs = { ...contactPrefs, [method]: value }
    setContactPrefs(newPrefs)
    setValue("contact_preferences", newPrefs)
  }

  const onFormSubmit = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
        brand_id: data.brand_id || null,
        model_id: data.model_id || null,
        reference: data.reference || null,
        dial_color: data.dial_color || null,
        max_price: data.max_price && data.max_price !== "" ? parseFloat(data.max_price) : null,
        location: data.location || null,
        accessory_type: data.accessory_type || null,
        is_public: isPublic,
        contact_preferences: contactPrefs
      })
      reset()
      setSelectedBrand("")
      setIsPublic(true)
      setContactPrefs({ email: true, phone: false, whatsapp: false })
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isPublic ? <Eye className="h-5 w-5 text-green-600" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
          Create Active Search
        </CardTitle>
        <CardDescription>
          Let other professionals know what you're looking for. This will be visible to all sellers on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Search Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Looking for Rolex Submariner 126610LN"
                {...register("title")}
              />
              <FormError message={errors.title?.message} />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what you're looking for in detail..."
                className="min-h-[100px]"
                {...register("description")}
              />
              <FormError message={errors.description?.message} />
            </div>

            <div>
              <Label htmlFor="type">Type *</Label>
              <Select onValueChange={(value) => setValue("type", value as "watch" | "accessory")} defaultValue={watchType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="watch">Watch</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                </SelectContent>
              </Select>
              <FormError message={errors.type?.message} />
            </div>
          </div>

          {/* Brand and Model Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Select onValueChange={handleBrandChange} value={selectedBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand (optional)" />
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
              <div>
                <Label htmlFor="model">Model</Label>
                <Select onValueChange={(value) => setValue("model_id", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {models[selectedBrandId].map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="e.g., 126610LN"
                {...register("reference")}
              />
            </div>

            {watchType === "watch" && (
              <div>
                <Label htmlFor="dial_color">Dial Color</Label>
                <Input
                  id="dial_color"
                  placeholder="e.g., Black, Blue, Green"
                  {...register("dial_color")}
                />
              </div>
            )}

            {watchType === "accessory" && (
              <div>
                <Label htmlFor="accessory_type">Accessory Type</Label>
                <Select onValueChange={(value) => setValue("accessory_type", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select accessory type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hands">Hands</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                    <SelectItem value="Bracelet">Bracelet</SelectItem>
                    <SelectItem value="Dial">Dial</SelectItem>
                    <SelectItem value="Bezel">Bezel</SelectItem>
                    <SelectItem value="Link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Price and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="max_price">Maximum Price (€)</Label>
              <Input
                id="max_price"
                type="number"
                placeholder="e.g., 10000"
                {...register("max_price")}
              />
            </div>

            <div>
              <Label htmlFor="location">Preferred Location</Label>
              <Select onValueChange={(value) => setValue("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.flag} {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Contact Preferences</Label>
            <p className="text-sm text-muted-foreground">
              How would you like to be contacted when someone has what you're looking for?
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <Label htmlFor="email-contact" className="font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground">Receive offers via email</p>
                  </div>
                </div>
                <Switch
                  id="email-contact"
                  checked={contactPrefs.email}
                  onCheckedChange={(checked) => handleContactPrefChange("email", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <Label htmlFor="phone-contact" className="font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground">Receive calls from interested sellers</p>
                  </div>
                </div>
                <Switch
                  id="phone-contact"
                  checked={contactPrefs.phone}
                  onCheckedChange={(checked) => handleContactPrefChange("phone", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <div>
                    <Label htmlFor="whatsapp-contact" className="font-medium">WhatsApp</Label>
                    <p className="text-sm text-muted-foreground">Receive WhatsApp messages</p>
                  </div>
                </div>
                <Switch
                  id="whatsapp-contact"
                  checked={contactPrefs.whatsapp}
                  onCheckedChange={(checked) => handleContactPrefChange("whatsapp", checked)}
                />
              </div>
            </div>
            
            <FormError message={errors.contact_preferences?.message} />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Active Search"}
          </Button>

          {/* Preview Badge */}
          {isPublic && (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Eye className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                This search will be visible to all sellers
              </span>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 