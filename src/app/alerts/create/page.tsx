"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CustomAlertForm from "@/components/forms/CustomAlertForm"
import { CustomAlertInsert } from "@/types/db/notifications/CustomAlerts"

export default function CreateAlertPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (data: Omit<CustomAlertInsert, 'user_id'>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/custom-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create alert')
      }

      router.push("/notifications?tab=active")
    } catch (error) {
      console.error('Error creating alert:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container py-4 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2 sm:mb-4">
            Create a Custom Alert
          </h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Set up alerts to be notified when watches matching your criteria are listed
          </p>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <CustomAlertForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </main>
  )
} 