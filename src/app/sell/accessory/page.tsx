"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AccessoryForm from "@/components/forms/AccessoryForm"
import { useToast } from "@/components/ui/use-toast"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create listing')
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
    <ProtectedRoute requireSeller requireVerified>
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

        <AccessoryForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
    </ProtectedRoute>
  )
}