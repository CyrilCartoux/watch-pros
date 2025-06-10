"use client"

import { useState } from 'react'
import { SubscriptionStep } from '@/components/SubscriptionStep'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface PaymentTabProps {
  selectedPlan: string
}

export function PaymentTab({ selectedPlan }: PaymentTabProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSuccess = (subscriptionId: string) => {
    toast({
      title: "Subscription successful!",
      description: "Your account has been activated.",
    })
    router.push('/account')
  }

  const handleError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <SubscriptionStep
        plan={selectedPlan}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  )
} 