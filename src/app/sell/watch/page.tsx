"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import WatchForm from "@/components/forms/WatchForm"
import { useToast } from "@/components/ui/use-toast"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function SellWatchPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

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

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create listing')
      }

      router.push("/sell/success")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create listing. Please try again.",
        variant: "destructive",
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
            List a Watch for Sale
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Complete the information below to create your listing
          </p>
        </div>

        <WatchForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
    </ProtectedRoute>
  )
} 