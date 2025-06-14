"use client"

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

interface PaymentFormWrapperProps {
  onPaymentComplete: () => void
  onPaymentError: (error: string) => void
  onPaymentFormChange: (isComplete: boolean) => void
}

export function PaymentFormWrapper({ 
  onPaymentComplete, 
  onPaymentError,
  onPaymentFormChange 
}: PaymentFormWrapperProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    if (!stripe || !elements) {
      onPaymentError('Payment system not initialized')
      return
    }

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/register/verify`,
        },
      })

      if (paymentError) {
        setError(paymentError.message || 'Payment failed')
        onPaymentError(paymentError.message || 'Payment failed')
        return
      }

      onPaymentComplete()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onPaymentError(errorMessage)
    }
  }

  // Expose handlePayment to parent
  useEffect(() => {
    // @ts-ignore - we're adding a custom property to window
    window.handleStripePayment = handlePayment
  }, [handlePayment])

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      <PaymentElement 
        onChange={(e) => {
          onPaymentFormChange(Boolean(e.complete))
        }}
      />
    </div>
  )
} 