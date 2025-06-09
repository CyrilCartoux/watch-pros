'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionStepProps {
  plan: string
  onSuccess: (subscriptionId: string) => void
  onError: (error: string) => void
}

function SubscriptionForm({ onSuccess, onError }: Omit<SubscriptionStepProps, 'plan'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/register/verify`,
        },
      })

      if (submitError) {
        setError(submitError.message || 'An error occurred')
        onError(submitError.message || 'An error occurred')
      } else {
        onSuccess('subscription_success')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      onError('An unexpected error occurred')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || processing}
        className="w-full"
      >
        {processing ? 'Processing...' : 'Subscribe Now'}
      </Button>
    </form>
  )
}

export function SubscriptionStep({ plan, onSuccess, onError }: SubscriptionStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create subscription intent
    fetch('/api/create-subscription-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          onError(data.error)
        } else {
          setClientSecret(data.clientSecret)
        }
      })
      .catch((err) => {
        onError('Failed to initialize payment')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [plan, onError])

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <p>Loading payment form...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 p-4 text-red-800 bg-red-100 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>Failed to load payment form</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Subscription</CardTitle>
        <CardDescription>
          Enter your payment details to complete your subscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#0f172a',
              },
            },
          }}
        >
          <SubscriptionForm onSuccess={onSuccess} onError={onError} />
        </Elements>
      </CardContent>
    </Card>
  )
} 