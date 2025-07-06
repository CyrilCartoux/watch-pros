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
import { Check, Clock, Crown, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentFormWrapper } from '@/components/PaymentFormWrapper'
import { useAuthStatus } from "@/hooks/useAuthStatus"
import { PlacesLeft } from "@/components/PlacesLeft"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type Plan = typeof plans[0]
type Subscription = {
  id: string
  status: string
  price_id: string
  current_period_end: string
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
  activeListingsCount: number
}

export default function SubscriptionPage() {
  const { user } = useAuth()
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionResponse | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isPaymentFormComplete, setIsPaymentFormComplete] = useState(false)

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

  const handlePlanSelect = async (plan: Plan) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/auth')
      return
    }

    if (subscriptionData?.hasActiveSubscription) {
      // Si changement d'abonnement, ouvrir le dialog
      setSelectedPlan(plan)
      setIsDialogOpen(true)
    } else {
      // Si nouveau abonnement, procéder directement
      try {
        setIsUpdating(true)
        setSelectedPlan(plan)

        // Récupérer les données du vendeur
        const response = await fetch('/api/sellers/current')
        if (!response.ok) {
          throw new Error('Failed to fetch seller data')
        }
        const sellerData = await response.json()

        // Création d'un nouvel abonnement
        const createResponse = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            priceId: plan.priceId,
            account: {
              companyName: sellerData.company_name,
              companyStatus: sellerData.company_status,
              firstName: sellerData.first_name,
              lastName: sellerData.last_name,
              watchProsName: sellerData.watch_pros_name,
              country: sellerData.country,
              phone: sellerData.phone,
              phonePrefix: sellerData.phone_prefix,
            },
            address: {
              street: sellerData.seller_addresses.street,
              city: sellerData.seller_addresses.city,
              country: sellerData.seller_addresses.country,
              postalCode: sellerData.seller_addresses.postal_code,
              website: sellerData.seller_addresses.website,
              siren: sellerData.seller_addresses.siren,
              taxId: sellerData.seller_addresses.tax_id,
              vatNumber: sellerData.seller_addresses.vat_number,
            }
          }),
        })

        if (!createResponse.ok) {
          const error = await createResponse.json()
          throw new Error(error.error || 'Failed to create subscription')
        }

        const { clientSecret } = await createResponse.json()
        
        // Ouvrir le formulaire de paiement
        setClientSecret(clientSecret)
        setShowPaymentForm(true)
      } catch (error) {
        console.error('Error creating subscription:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create subscription",
        })
      } finally {
        setIsUpdating(false)
        setSelectedPlan(null)
      }
    }
  }

  const handleConfirmSubscription = async () => {
    if (!selectedPlan) return

    try {
      setIsUpdating(true)

      // Mise à jour de l'abonnement existant
      const updateResponse = await fetch('/api/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: selectedPlan.priceId,
        }),
      })

      if (!updateResponse.ok) {
        const error = await updateResponse.json()
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
      setSelectedPlan(null)
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

  const handlePaymentComplete = async () => {
    try {
      setIsUpdating(true)
      // @ts-ignore - we're using a custom property
      await window.handleStripePayment()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive",
    })
  }

  // Show loading only if user is authenticated and we're fetching subscription data
  if (user && subscriptionData === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include our core features with no hidden fees or commissions.
          </p>
        </div>

        {/* FOMO Section - Places Left */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6 mb-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-amber-800">Limited Time Offer</h3>
            </div>
            
            <div className="flex justify-center ">
              <PlacesLeft />
            </div>
            
            <div className="bg-white/80 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-amber-700 font-medium">
                ⚡ <strong>Early Bird Pricing</strong> - Lock in these rates forever!
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Once all spots are filled, pricing will increase to regular rates
              </p>
            </div>
          </div>
        </div>

        {/* Current Subscription Status - Only show if user is authenticated */}
        {user && (
          <div className="text-center mb-12">
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
                <div className="text-sm text-gray-600">
                  You currently have <span className="font-semibold">{subscriptionData?.activeListingsCount || 0}</span> active listings
                  {subscriptionData?.subscription?.subscription_plans?.max_listings && (
                    <span> out of {subscriptionData.subscription.subscription_plans.max_listings} allowed</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800">
                  <span className="font-medium">
                    No active subscription
                  </span>
                </div>
                <p className="text-gray-600">
                  Choose a plan below to start selling your watches on Watch Pros®.
                </p>
                {subscriptionData?.activeListingsCount && subscriptionData.activeListingsCount > 0 && (
                  <div className="text-sm text-gray-600">
                    You currently have <span className="font-semibold">{subscriptionData.activeListingsCount}</span> active listings
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <Card className="border-2 border-border hover:border-primary/40 transition-all duration-300 group h-full flex flex-col">
            <CardHeader>
              <CardTitle>Pioneer Program - Unlimited</CardTitle>
              <CardDescription>Limited time early bird pricing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="mb-6">
                <span className="text-3xl font-bold">€59</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-2 flex-1">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>No commitment</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Unlimited listings</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Cancel anytime</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Professional dashboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Zero commission</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {user ? (
                <Button
                  className="w-full"
                  variant={subscriptionData?.subscription?.price_id === 'price_1ReeZ8RWMXxAzKAEUqSNvFBS' ? "outline" : "default"}
                  onClick={() => handlePlanSelect({ 
                    name: 'Pioneer Program - Unlimited', 
                    priceId: 'price_1ReeZ8RWMXxAzKAEUqSNvFBS', 
                    price: { early: 59, regular: 59 },
                    description: 'Limited time early bird pricing',
                    features: ['No commitment', 'Unlimited listings', 'Cancel anytime', 'Professional dashboard', 'Zero commission'],
                    maxListings: null
                  })}
                  disabled={subscriptionData?.subscription?.price_id === 'price_1ReeZ8RWMXxAzKAEUqSNvFBS'}
                >
                  {subscriptionData?.subscription?.price_id === 'price_1ReeZ8RWMXxAzKAEUqSNvFBS' ? 'Current Plan' : 
                   (subscriptionData?.hasActiveSubscription ? 'Change Plan' : 'Subscribe')}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => router.push('/auth')}
                >
                  Sign in to Subscribe
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Annual Plan */}
          <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary/40 transition-all duration-300 group relative h-full flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                BEST VALUE
              </Badge>
            </div>
            <CardHeader>
              <CardTitle>Pioneer Program - Unlimited (1 year)</CardTitle>
              <CardDescription>Limited time early bird pricing</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <div className="mb-6">
                <span className="text-3xl font-bold">€599</span>
                <span className="text-gray-500">/year</span>
                <div className="text-sm text-green-600 font-semibold mt-1">
                  Save €109 (2 months free)
                </div>
                <div className="text-xs text-gray-500">
                  Only €49.9/month
                </div>
              </div>
              <ul className="space-y-2 flex-1">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>2 months free</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Unlimited listings</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Professional dashboard</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span>Zero commission</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              {user ? (
                <Button
                  className="w-full"
                  variant={subscriptionData?.subscription?.price_id === 'price_1ReeeLRWMXxAzKAERWs4Bgrd' ? "outline" : "default"}
                  onClick={() => handlePlanSelect({ 
                    name: 'Pioneer Program - Unlimited (1 year)', 
                    priceId: 'price_1ReeeLRWMXxAzKAERWs4Bgrd', 
                    price: { early: 599, regular: 708 },
                    description: 'Lock in early-bird pricing and save €109 per year',
                    features: ['2 months free', 'Unlimited listings', 'Priority support', 'Professional dashboard', 'Zero commission'],
                    maxListings: null
                  })}
                  disabled={subscriptionData?.subscription?.price_id === 'price_1ReeeLRWMXxAzKAERWs4Bgrd'}
                >
                  {subscriptionData?.subscription?.price_id === 'price_1ReeeLRWMXxAzKAERWs4Bgrd' ? 'Current Plan' : 
                   (subscriptionData?.hasActiveSubscription ? 'Change Plan' : 'Subscribe')}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => router.push('/auth')}
                >
                  Sign in to Subscribe
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
                <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What happens if I exceed my listing limit?</h3>
                <p className="text-muted-foreground">You'll be notified when you're close to your limit. You can either upgrade your plan or delete some listings.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Is there a long-term commitment?</h3>
                <p className="text-muted-foreground">No, all plans are billed monthly and can be cancelled at any time. Early-bird pricing is locked in for as long as you maintain an active account.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Do you charge commission on sales?</h3>
                <p className="text-muted-foreground">No, we don't take any commission on sales. You keep 100% of your revenue.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Only show dialogs if user is authenticated */}
      {user && (
        <>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Subscription Plan</DialogTitle>
                <DialogDescription>
                  Are you sure you want to switch from{' '}
                  <span className="font-semibold">
                    {plans.find(p => p.priceId === subscriptionData.subscription?.price_id)?.name}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold">{selectedPlan?.name}</span>?
                  {subscriptionData.subscription?.cancel_at_period_end && (
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
                  onClick={handleConfirmSubscription}
                  disabled={isUpdating || !selectedPlan}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm Change'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Payment Form Dialog */}
          <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Complete Your Subscription</DialogTitle>
                <DialogDescription>
                  You are about to subscribe to the{' '}
                  <span className="font-semibold">{selectedPlan?.name}</span> plan.
                  <div className="mt-2 text-sm text-gray-600">
                    This plan includes:
                    <ul className="list-disc list-inside mt-1">
                      {selectedPlan?.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 overflow-y-auto flex-1">
                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: "stripe",
                        variables: {
                          colorPrimary: "#0f172a",
                        },
                      },
                    }}
                  >
                    <PaymentFormWrapper
                      onPaymentComplete={handlePaymentComplete}
                      onPaymentError={handlePaymentError}
                      onPaymentFormChange={setIsPaymentFormComplete}
                    />
                  </Elements>
                )}
              </div>
              <DialogFooter className="flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPaymentForm(false)
                    setSelectedPlan(null)
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePaymentComplete}
                  disabled={isUpdating || !isPaymentFormComplete}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Complete Subscription'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}