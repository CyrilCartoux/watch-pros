"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AccessoryForm from "@/components/forms/AccessoryForm"
import { useToast } from "@/components/ui/use-toast"
import { Check } from "lucide-react"

const steps = [
  {
    id: 1,
    name: "Accessory Details",
    description: "Basic information about your accessory",
    shortName: "Details",
  },
  {
    id: 2,
    name: "Condition & Price",
    description: "Specify condition and set your price",
    shortName: "Price",
  },
  {
    id: 3,
    name: "Photos & Documents",
    description: "Add photos and supporting documents",
    shortName: "Photos",
  },
]

export default function SellAccessoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      if (data.images && data.images.length > 0) {
        data.images.forEach((image: File | string) => {
          if (image instanceof File) {
            formData.append('images', image)
          } else if (typeof image === 'string' && image.startsWith('http')) {
            formData.append('images', image)
          }
        })
      }

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

      const responseData = await response.json()

      if (!response.ok) {
        if (
          responseData.error === "Listing quota exceeded for this subscription"
        ) {
          toast({
            title: "Error",
            description:
              "You have reached the maximum number of listings for your subscription. Please upgrade to a higher plan.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(responseData.error || "Failed to create listing");
      }

      router.push("/sell/success")
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: 'Failed to create listing',
        description: 'Please try again',
        variant: 'destructive'
      })
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

        {/* Stepper - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <nav aria-label="Progress">
            {/* Mobile: Compact horizontal layout */}
            <div className="md:hidden">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div className="flex items-center w-full">
                      {/* Line before step (except first) */}
                      {index > 0 && (
                        <div className="flex-1 h-0.5 bg-muted-foreground/30 mx-2" />
                      )}
                      
                      {/* Step circle */}
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {step.id}
                        </div>
                      </div>
                      
                      {/* Line after step (except last) */}
                      {index < steps.length - 1 && (
                        <div className="flex-1 h-0.5 bg-muted-foreground/30 mx-2" />
                      )}
                    </div>
                    
                    {/* Step label */}
                    <span className="text-xs font-medium text-primary mt-2 text-center px-1">
                      {step.shortName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Original layout */}
            <ol role="list" className="hidden md:flex md:space-x-8">
              {steps.map((step, index) => (
                <li key={step.id} className="flex-1">
                  <div className="group flex flex-col border-t-4 border-primary pt-4">
                    <span className="text-sm font-medium text-primary">{step.name}</span>
                    <span className="text-sm text-muted-foreground">{step.description}</span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <AccessoryForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  )
}