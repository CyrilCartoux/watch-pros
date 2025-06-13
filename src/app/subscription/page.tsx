'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { plans } from '@/data/subscription-plans'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from 'lucide-react'

type Plan = typeof plans[0]
type Subscription = {
  id: string
  status: string
  price_id: string
  current_period_end: string
  stripe_subscription_id: string
  stripe_customer_id: string
  product_id: string | null
  payment_method_id: string | null
  pm_type: string | null
  pm_last4: string | null
  pm_brand: string | null
  trial_end: string | null
  current_period_start: string | null
  cancel_at_period_end: boolean
  canceled_at: string | null
  subscription_plans: {
    max_listings: number | null
  }
}

type SubscriptionResponse = {
  hasActiveSubscription: boolean
  subscription: Subscription | null
}

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionResponse | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchCurrentSubscription()
    }
  }, [user])

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/subscription/current')
      if (!response.ok) {
        throw new Error('Failed to fetch subscription')
      }

      const data = await response.json()
      setSubscriptionData(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to retrieve your subscription information",
      })
    }
  }

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan)
    setIsDialogOpen(true)
  }

  const handleConfirmChange = async () => {
    if (!selectedPlan) return

    try {
      setIsUpdating(true)
      const response = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan.priceId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update subscription')
      }

      toast({
        title: "Success",
        description: "Your subscription has been updated successfully.",
      })

      // Refresh subscription data
      await fetchCurrentSubscription()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update subscription",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPaymentMethodInfo = (subscription: Subscription) => {
    if (!subscription.pm_type || !subscription.pm_last4) return null

    const brand = subscription.pm_brand?.toLowerCase() || 'card'
    return {
      type: subscription.pm_type,
      last4: subscription.pm_last4,
      brand
    }
  }

  if (subscriptionData === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Subscription</h1>
          {subscriptionData?.hasActiveSubscription && subscriptionData.subscription ? (
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                <span className="font-medium">
                  Current Plan: {plans.find(p => p.priceId === subscriptionData.subscription?.price_id)?.name}
                </span>
                {subscriptionData.subscription.current_period_end && (
                  <span className="ml-2 text-sm">
                    (Renewal on {formatDate(subscriptionData.subscription.current_period_end)})
                  </span>
                )}
              </div>
              {getPaymentMethodInfo(subscriptionData.subscription) && (
                <div className="text-sm text-gray-600">
                  Payment by {getPaymentMethodInfo(subscriptionData.subscription)?.brand} ending in {getPaymentMethodInfo(subscriptionData.subscription)?.last4}
                </div>
              )}
              {subscriptionData.subscription.subscription_plans?.max_listings && (
                <div className="text-sm text-gray-600">
                  Limit of {subscriptionData.subscription.subscription_plans.max_listings} active listings
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800">
                <span className="font-medium">
                  No active subscription
                </span>
              </div>
              <p className="text-gray-600">
                Choose a plan below to start selling your watches on Watch Pros.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = subscriptionData?.subscription?.price_id === plan.priceId
            const isHighlighted = plan.highlighted

            return (
              <Card 
                key={plan.name}
                className={`relative ${isHighlighted ? 'border-blue-500' : ''} ${isCurrentPlan ? 'border-green-500' : ''}`}
              >
                {isHighlighted && (
                  <Badge className="absolute -top-3 -right-3 bg-blue-500">
                    Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price.early}€</span>
                    <span className="text-gray-500">/month</span>
                    <div className="text-sm text-gray-500">
                      Regular price: {plan.price.regular}€/month
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? "outline" : "default"}
                    onClick={() => handlePlanSelect(plan)}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : 'Change Plan'}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Subscription Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to change your subscription to {selectedPlan?.name}?
              {subscriptionData?.subscription?.cancel_at_period_end && (
                <div className="mt-2 text-sm text-yellow-600">
                  Note: Your subscription is currently set to cancel at the end of the billing period.
                  Changing plans will remove this cancellation.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setSelectedPlan(null)
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmChange}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                'Confirm Change'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}