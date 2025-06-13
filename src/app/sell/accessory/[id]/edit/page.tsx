"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AccessoryForm from "@/components/forms/AccessoryForm"
import { useToast } from "@/components/ui/use-toast"

export default function EditAccessoryPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [listingData, setListingData] = useState<any>(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch listing')
        }
        const data = await response.json()
        setListingData(data)
      } catch (error) {
        console.error(error)
        toast({
          title: "Error",
          description: "Failed to load listing data",
          variant: "destructive",
        })
        router.push("/account?tab=dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [params.id, router, toast])

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

      const response = await fetch(`/api/listings/${params.id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update listing')
      }

      toast({
        title: "Success",
        description: "Listing updated successfully",
      })
      router.push("/account?tab=dashboard")
    } catch (error) {
      console.error('Error updating listing:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update listing",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="container py-4 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4">
            Edit Accessory Listing
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Update your accessory listing information
          </p>
        </div>

        <AccessoryForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          initialData={listingData}
          isEditing={true}
        />
      </div>
    </main>
  )
} 