"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { dialColors } from "@/data/watch-properties";
import { accessoryTypes } from "@/data/accessory-properties";
import Image from "next/image";
import { useBrandsAndModels } from "@/hooks/useBrandsAndModels";
import { currencies } from "@/data/form-options";

// Add a component to display errors
const FormError = ({
  error,
  isSubmitted,
}: {
  error?: string;
  isSubmitted: boolean;
}) => {
  if (!error || !isSubmitted) return null;
  return <p className="text-sm text-red-500 mt-1">{error}</p>;
};

// Validation schema for the accessory form
const accessorySchema = z.object({
  // Common fields
  accessory_type: z.string().min(1, "Accessory type is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must not exceed 100 characters"),
  year: z.string().nullable().default(""),
  yearUnknown: z.boolean().default(false),
  reference: z.string().default(""),
  description: z.string().default(""),
  condition: z.string().min(1, "Condition is required"),
  images: z
    .array(z.union([z.instanceof(File), z.string()]))
    .min(1, "At least one photo is required")
    .max(10, "Maximum 10 photos"),
  price: z.number().min(1, "Price is required"),
  currency: z.string().default("USD"),
  shippingDelay: z.string().min(1, "Shipping delay is required"),
  documents: z.array(z.instanceof(File)).optional(),
  listing_type: z.string().default("accessory"),
  dialColor: z.string().default(""),
});

type FormData = z.infer<typeof accessorySchema>;

const popularBrands = [
  {
    slug: "rolex",
    label: "Rolex",
    image: "/images/brands/rolex.png",
  },
  {
    slug: "omega",
    label: "Omega",
    image: "/images/brands/omega.png",
  },
  {
    slug: "audemars-piguet",
    label: "Audemars Piguet",
    image: "/images/brands/audemars-piguet.png",
  },
  {
    slug: "patek-philippe",
    label: "Patek Philippe",
    image: "/images/brands/patek-philippe.png",
  },
  {
    slug: "cartier",
    label: "Cartier",
    image: "/images/brands/cartier.png",
  },
];

interface AccessoryFormProps {
  onSubmit: (data: FormData) => void;
  isSubmitting?: boolean;
  initialData?: any;
  isEditing?: boolean;
}

export default function AccessoryForm({
  onSubmit,
  isSubmitting = false,
  initialData,
  isEditing = false,
}: AccessoryFormProps) {
  const [step, setStep] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState(initialData?.brand || "");
  const [selectedModel, setSelectedModel] = useState(initialData?.model || "");
  const [previewTitle, setPreviewTitle] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isStepSubmitted, setIsStepSubmitted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { brands, models, isLoading, fetchModels } = useBrandsAndModels();

  const form = useForm<FormData>({
    resolver: zodResolver(accessorySchema),
    defaultValues: {
      brand: "",
      model: "",
      reference: "",
      title: "",
      description: "",
      year: "",
      yearUnknown: false,
      country: "",
      accessory_type: "",
      included: "",
      condition: "",
      images: [],
      price: 0,
      currency: "USD",
      shippingDelay: "",
      documents: [] as File[],
      listing_type: "accessory",
      dialColor: "",
      ...initialData,
    },
    mode: "onChange",
  });

  // Step validation
  const validateStep = async (stepNumber: number) => {
    let fieldsToValidate: (keyof FormData)[] = [];

    switch (stepNumber) {
      case 1:
        fieldsToValidate = ["accessory_type", "brand", "model", "title"];
        break;
      case 2:
        fieldsToValidate = ["condition"];
        break;
      case 3:
        fieldsToValidate = ["price", "shippingDelay"];
        break;
      case 4:
        fieldsToValidate = ["images"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    setIsStepSubmitted(true);
    return result;
  };

  // Handle existing images in edit mode
  useEffect(() => {
    if (isEditing && initialData?.images) {
      setImagePreviews(initialData.images);
      // Create a dummy File object for each existing image to satisfy the validation
      const dummyFiles = initialData.images.map((url: string) => {
        return new File([], url, { type: "image/jpeg" });
      });
      setSelectedImages(dummyFiles);
      form.setValue("images", dummyFiles);
    }
  }, [isEditing, initialData]);

  // Update title preview when title changes
  useEffect(() => {
    setPreviewTitle(form.watch("title"));
  }, [form.watch("title")]);

  // Auto-complete title when brand, model or reference changes
  useEffect(() => {
    const accessoryType = form.watch("accessory_type");
    const brand = brands.find((b) => b.id === form.watch("brand"))?.label;
    const model =
      selectedBrand &&
      models[selectedBrand]?.find((m) => m.id === form.watch("model"))?.label;
    const reference = form.watch("reference");

    if (accessoryType && brand && model) {
      const suggestedTitle = `${accessoryType} - ${brand} - ${model}${reference ? ` - ${reference}` : ""}`;
      form.setValue("title", suggestedTitle);
    }
  }, [
    form.watch("brand"),
    form.watch("model"),
    form.watch("reference"),
    brands,
    models,
    selectedBrand,
  ]);

  const handleBrandChange = async (value: string) => {
    setSelectedBrand(value);
    setSelectedModel("");
    form.setValue("brand", value);
    form.setValue("model", "");
    await fetchModels(value);
  };

  const handlePopularBrandClick = async (brandSlug: string) => {
    const brand = brands.find((b) => b.slug === brandSlug);
    if (brand) {
      await handleBrandChange(brand.id);
    }
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    form.setValue("model", value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // File validation
    const validFiles = files.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size: 5MB`);
        return false;
      }
      if (
        !["image/jpeg", "image/png", "image/webp", "image/heic"].includes(
          file.type
        )
      ) {
        alert(
          `File ${file.name} is not an accepted image format. Accepted formats: JPG, PNG, WEBP, HEIC`
        );
        return false;
      }
      return true;
    });

    if (validFiles.length + selectedImages.length > 10) {
      alert("You cannot add more than 10 images");
      return;
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
    form.setValue("images", [...selectedImages, ...validFiles] as never[]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    form.setValue(
      "images",
      selectedImages.filter((_, i) => i !== index) as never[]
    );
  };

  const nextStep = async () => {
    const isValid = await validateStep(step);

    if (isValid) {
      setIsStepSubmitted(false);
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setIsStepSubmitted(false);
    setStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
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
                    <Label htmlFor="accessory_type">Accessory type *</Label>
                    <Controller
                      name="accessory_type"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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
                      )}
                    />
                    <FormError
                      error={
                        form.formState.errors.accessory_type?.message as string
                      }
                      isSubmitted={isStepSubmitted}
                    />
                  </div>

                  {/* Popular brands */}
                  <div className="space-y-2">
                    <Label>Popular brands *</Label>
                    <div className="grid grid-cols-5 sm:grid-cols-3 md:grid-cols-5 gap-1 sm:gap-2">
                      {popularBrands.map((brand) => (
                        <button
                          key={brand.slug}
                          type="button"
                          onClick={() => handlePopularBrandClick(brand.slug)}
                          className={`relative aspect-square rounded-lg border-2 transition-colors ${
                            brands.find((b) => b.id === form.watch("brand"))
                              ?.slug === brand.slug
                              ? "border-primary bg-primary/5"
                              : "border-input hover:border-primary/50"
                          }`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2">
                            <Image
                              src={brand.image}
                              alt={brand.label}
                              fill
                              sizes="(max-width: 640px) 20vw, (max-width: 768px) 33vw, 20vw"
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
                        <Select
                          onValueChange={handleBrandChange}
                          value={field.value}
                        >
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
                    <FormError
                      error={form.formState.errors.brand?.message as string}
                      isSubmitted={isStepSubmitted}
                    />
                  </div>

                  {/* Popular models */}
                  {selectedBrand && models[selectedBrand] && (
                    <div className="space-y-2">
                      <Label>Models *</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2">
                        {models[selectedBrand]
                          .filter((m) => m.popular)
                          .map((model) => (
                            <button
                              key={model.id}
                              type="button"
                              onClick={() => handleModelChange(model.id)}
                              className={`relative aspect-[4/1] sm:aspect-[3/2] rounded-lg border-2 transition-colors ${
                                form.watch("model") === model.id
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
                            {selectedBrand &&
                              models[selectedBrand]?.map((model) => (
                                <SelectItem key={model.id} value={model.id}>
                                  {model.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError
                      error={form.formState.errors.model?.message as string}
                      isSubmitted={isStepSubmitted}
                    />
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
                    <FormError
                      error={form.formState.errors.reference?.message as string}
                      isSubmitted={isStepSubmitted}
                    />
                  </div>

                  {/* Listing title */}
                  <div className="space-y-4">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Complete the listing title"
                      maxLength={40}
                      {...form.register("title")}
                    />
                    <FormError
                      error={form.formState.errors.title?.message as string}
                      isSubmitted={isStepSubmitted}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {form.watch("title")?.length || 0} / 40
                    </p>
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
                    <FormError
                      error={
                        form.formState.errors.description?.message as string
                      }
                      isSubmitted={isStepSubmitted}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="year">Manufacturing year</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="yearUnknown"
                          checked={form.watch("yearUnknown")}
                          onCheckedChange={(checked) => {
                            form.setValue("yearUnknown", checked as boolean);
                            if (checked) {
                              form.setValue("year", "");
                            }
                          }}
                        />
                        <Label htmlFor="yearUnknown" className="text-sm">
                          Unknown year
                        </Label>
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
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Accessory condition</h3>
                  <FormError
                    error={form.formState.errors.condition?.message}
                    isSubmitted={isStepSubmitted}
                  />
                  <div className="grid gap-4">
                    <Card
                      className={`cursor-pointer transition-colors ${
                        form.watch("condition") === "new"
                          ? "border-primary"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => {
                        form.setValue("condition", "new", {
                          shouldValidate: true,
                        });
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
                              The accessory is in its original condition, never
                              used
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
                        form.setValue("condition", "used", {
                          shouldValidate: true,
                        });
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
                              The accessory has been used but is in good
                              condition
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {step === 3 && (
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
                          className="flex-1"
                        />
                        <Controller
                          name="currency"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {currencies.map((currency) => (
                                  <SelectItem
                                    key={currency.value}
                                    value={currency.value}
                                  >
                                    {currency.flag} {currency.label} (
                                    {currency.symbol})
                                  </SelectItem>
                                ))}
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
                        onValueChange={(value) =>
                          form.setValue("shippingDelay", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select shipping time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 business days</SelectItem>
                          <SelectItem value="2-3">2-3 business days</SelectItem>
                          <SelectItem value="3-5">3-5 business days</SelectItem>
                          <SelectItem value="5-7">5-7 business days</SelectItem>
                          <SelectItem value="7-10">
                            7-10 business days
                          </SelectItem>
                          <SelectItem value="10+">
                            More than 10 business days
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormError
                        error={
                          form.formState.errors.shippingDelay?.message as string
                        }
                        isSubmitted={isStepSubmitted}
                      />
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Sale price
                            </span>
                            <span className="font-medium">
                              {form.watch("price")?.toLocaleString()}{" "}
                              {form.watch("currency")}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <FormError
                      error={form.formState.errors.price?.message as string}
                      isSubmitted={isStepSubmitted}
                    />
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Accessory photos</h3>
                  <FormError
                    error={form.formState.errors.images?.message}
                    isSubmitted={isStepSubmitted}
                  />
                  <p className="text-sm text-muted-foreground mb-4">
                    Add up to 10 photos of your accessory. Accepted formats:
                    JPG, PNG, WEBP. Maximum size: 5MB per photo.
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
                  <h3 className="text-lg font-semibold">
                    Important documents (optional)
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add important documents such as invoices, certificates of
                    authenticity, etc. These documents will only be visible to
                    the final buyer after transaction validation.
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
                              const newDocs =
                                form
                                  .watch("documents")
                                  ?.filter((_, i) => i !== index) || [];
                              form.setValue("documents", newDocs);
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
                          const files = Array.from(e.target.files || []);
                          const validFiles = files.filter((file) => {
                            if (file.size > 5 * 1024 * 1024) {
                              alert(
                                `File ${file.name} is too large. Maximum size: 5MB`
                              );
                              return false;
                            }
                            if (
                              ![".pdf", ".jpg", ".jpeg", ".png"].some((ext) =>
                                file.name.toLowerCase().endsWith(ext)
                              )
                            ) {
                              alert(
                                `File ${file.name} is not an accepted format. Accepted formats: PDF, JPG, PNG`
                              );
                              return false;
                            }
                            return true;
                          });
                          form.setValue("documents", [
                            ...(form.watch("documents") || []),
                            ...validFiles,
                          ]);
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
                {step < 4 ? (
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
                    onClick={() => {
                      form.handleSubmit((data) => {
                        onSubmit(data);
                      })();
                    }}
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
                        onClick={() =>
                          setCurrentImage((prev) =>
                            prev === 0 ? imagePreviews.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImage((prev) =>
                            prev === imagePreviews.length - 1 ? 0 : prev + 1
                          )
                        }
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
                              currentImage === index
                                ? "bg-white"
                                : "bg-white/50"
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
                <h4
                  className="font-medium truncate"
                  title={form.watch("title") || "Listing title"}
                >
                  {form.watch("title") || "Listing title"}
                </h4>
                <p
                  className="text-sm text-muted-foreground line-clamp-2"
                  title={
                    form.watch("description") || "Accessory description..."
                  }
                >
                  {form.watch("description") || "Accessory description..."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Brand</p>
                  <p className="font-medium">
                    {brands.find((b) => b.id === form.watch("brand"))?.label ||
                      "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p className="font-medium">
                    {(selectedBrand &&
                      models[selectedBrand]?.find(
                        (m) => m.id === form.watch("model")
                      )?.label) ||
                      "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Condition</p>
                  <p className="font-medium">
                    {form.watch("condition") === "new"
                      ? "New"
                      : form.watch("condition") === "used"
                        ? "Used"
                        : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shipping delay</p>
                  <p className="font-medium">
                    {form.watch("shippingDelay")
                      ? `${form.watch("shippingDelay")} business days`
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-muted-foreground">Price</p>
                  <p className="font-semibold text-lg">
                    {form.watch("price")
                      ? `${form.watch("price").toLocaleString()} ${form.watch("currency")}`
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
