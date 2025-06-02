"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import WatchForm from "@/components/forms/WatchForm"
import { useToast } from "@/components/ui/use-toast"

export default function EditWatchPage({ params }: { params: { id: string } }) {
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
      const response = await fetch(`/api/listings/${params.id}`, {
        method: 'PUT',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to update listing')
      }

      toast({
        title: "Success",
        description: "Listing updated successfully",
      })
      router.push("/account?tab=dashboard")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update listing",
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
            Edit Watch Listing
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Update your watch listing information
          </p>
        </div>

        <WatchForm
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          initialData={listingData}
          isEditing={true}
        />
      </div>
    </main>
  )
} 