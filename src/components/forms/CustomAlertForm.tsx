"use client"

import { useState, useCallback, useMemo } from "react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

import { useBrandsAndModels } from "@/hooks/useBrandsAndModels"
import { countries } from "@/data/form-options"
import { CustomAlertInsert } from "@/types/db/notifications/CustomAlerts"
import { dialColors } from "@/data/watch-properties"
import { accessoryTypes } from "@/data/accessory-properties"

const alertSchema = z
  .object({
    alert_type: z.enum(["watch", "accessory"]),
    brand_id: z.string().min(1, "Brand is required"),
    model_id: z.string().optional(),
    reference: z.string().nullable(),
    dial_color: z.string().nullable(),
    accessory_type: z.string().nullable(),
    max_price: z
      .number()
      .nullable()
      .refine((v) => v === null || v > 0, { message: "Must be a positive number" }),
    location: z.string().nullable(),
  })
  .required()

type FormData = z.infer<typeof alertSchema>
interface Props {
  onSubmit: (data: Omit<CustomAlertInsert, "user_id">) => Promise<void>
  isSubmitting?: boolean
}

const FormError = ({ message }: { message?: string }) =>
  message ? <p className="text-sm text-red-500 mt-1">{message}</p> : null

export default function CustomAlertForm({ onSubmit, isSubmitting = false }: Props) {
  const { toast } = useToast()
  const { brands, models, isLoading, fetchModels } = useBrandsAndModels()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      alert_type: "watch",
      brand_id: "",
      model_id: "",
      reference: "",
      dial_color: null,
      accessory_type: null,
      max_price: null,
      location: null,
    },
  })

  // Memoize watched values to avoid extra renders
  const alertType = watch("alert_type")
  const brandId = watch("brand_id")
  const modelId = watch("model_id")

  // Popular brands filtered against fetched 'brands'
  const popularBrandsData = useMemo(
    () =>
      [
        "rolex",
        "omega",
        "audemars-piguet",
        "patek-philippe",
        "cartier",
      ].reduce<(typeof brands)[0][]>((acc, slug) => {
        const b = brands.find((b) => b.slug === slug)
        if (b) acc.push(b)
        return acc
      }, []),
    [brands]
  )

  // Change alert type → clear specific fields
  const onAlertTypeChange = useCallback(
    (newAlertType: "watch" | "accessory") => {
      setValue("alert_type", newAlertType)
      setValue("dial_color", null)
      setValue("accessory_type", null)
    },
    [setValue]
  )

  // Change brand → clear model, fetch new ones
  const onBrandChange = useCallback(
    async (newBrandId: string) => {
      setValue("brand_id", newBrandId)
      setValue("model_id", "")
      try {
        await fetchModels(newBrandId)
      } catch {
        toast({
          title: "Error loading models",
          description: "Could not fetch models for this brand.",
          variant: "destructive",
        })
      }
      trigger("model_id")
    },
    [fetchModels, setValue, trigger, toast]
  )

  // Change model selection
  const onModelChange = useCallback(
    (newModelId: string) => {
      setValue("model_id", newModelId)
      trigger("model_id")
    },
    [setValue, trigger]
  )

  const submitHandler = useCallback(
    async (data: FormData) => {
      try {
        // Map alert_type to type and ensure all required fields are present
        const alertData = {
          type: data.alert_type,
          brand_id: data.brand_id,
          model_id: data.model_id,
          reference: data.reference,
          dial_color: data.dial_color,
          accessory_type: data.accessory_type,
          max_price: data.max_price,
          location: data.location,
        }
        
        await onSubmit(alertData)
        toast({
          title: "Alert created",
          description: `You will be notified when a matching ${data.alert_type} is listed.`,
        })
      } catch {
        toast({
          title: "Error",
          description: "Failed to create alert. Please try again.",
          variant: "destructive",
        })
      }
    },
    [onSubmit, toast]
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-4 bg-muted rounded ${i % 2 ? "w-1/3" : "w-full"}`} />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          <h3 className="text-lg font-semibold">Create a Custom Alert</h3>
          <p className="text-sm text-muted-foreground">
            Be notified when a {alertType} matching your criteria is listed.
          </p>

          {/* Alert Type Selection */}
          <div className="space-y-2">
            <Label>Alert Type *</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer transition-colors ${
                  alertType === "watch"
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => onAlertTypeChange("watch")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-lg">⌚</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Watch</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified for watch listings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${
                  alertType === "accessory"
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => onAlertTypeChange("accessory")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-lg">🔧</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Accessory</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified for accessory listings
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Accessory Type - only for accessory alerts */}
          {alertType === "accessory" && (
            <div>
              <Label htmlFor="accessory_type">Accessory Type</Label>
              <Controller
                control={control}
                name="accessory_type"
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accessory type" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessoryTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FormError message={errors.accessory_type?.message} />
            </div>
          )}

          {/* Brand */}
          <div className="space-y-2">
            <Label>Popular Brands *</Label>
            <div className="grid grid-cols-5 gap-2">
              {popularBrandsData.map((b) => (
                <button
                key={b.id}
                type="button"
                onClick={() => onBrandChange(b.id)}
                className={`relative aspect-square rounded-lg border-2 transition-colors ${
                  brandId === b.id
                    ? "border-primary bg-primary/5"
                    : "border-input hover:border-primary/50"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2">
                  <Image
                    src={`/images/brands/${b.slug}.png`}
                    alt={b.label}
                    fill
                    className="object-contain p-1 sm:p-2"
                  />
                </div>
              </button>
              ))}
            </div>
          </div>
          <Controller
            control={control}
            name="brand_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={onBrandChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FormError message={errors.brand_id?.message} />

          {/* Model */}
          {brandId && (
            <>
              {models[brandId]?.filter((m) => m.popular).length > 0 && (
                <>
                  <Label>Popular Models</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {models[brandId]
                      ?.filter((m) => m.popular)
                      .map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => onModelChange(m.id)}
                          className={`aspect-[4/1] rounded-lg border-2 transition-colors ${
                            modelId === m.id
                              ? "border-primary bg-primary/10"
                              : "border-input hover:border-primary"
                          }`}
                        >
                          <span className="text-xs font-medium truncate">{m.label}</span>
                        </button>
                      ))}
                  </div>
                </>
              )}

              <Controller
                control={control}
                name="model_id"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={onModelChange}
                    disabled={!brandId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models[brandId]?.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FormError message={errors.model_id?.message} />
            </>
          )}

          {/* Reference */}
          <div>
            <Label htmlFor="reference">Reference Number</Label>
            <Input id="reference" {...control.register("reference")} />
            <FormError message={errors.reference?.message} />
          </div>

          {/* Dial Color - only for watch alerts */}
          {alertType === "watch" && (
            <div>
              <Label htmlFor="dial_color">Dial Color</Label>
              <Controller
                control={control}
                name="dial_color"
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select dial color" />
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
              <FormError message={errors.dial_color?.message} />
            </div>
          )}

          {/* Max Price */}
          <div>
            <Label htmlFor="max_price">Max Price</Label>
            <Controller
              control={control}
              name="max_price"
              render={({ field }) => (
                <Input
                  id="max_price"
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? null : +e.target.value)
                  }
                />
              )}
            />
            <FormError message={errors.max_price?.message} />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span className="flex items-center gap-2">
                          {c.flag} {c.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormError message={errors.location?.message} />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating…" : "Create Alert"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
