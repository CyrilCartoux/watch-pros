'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small dealers',
    price: {
      early: 49,
      regular: 79
    },
    features: [
      'Up to 25 active listings',
      'Professional profile',
      'Direct messaging',
      'Email support'
    ],
    maxListings: 25
  },
  {
    name: 'Professional',
    description: 'Ideal for growing businesses',
    price: {
      early: 79,
      regular: 119
    },
    features: [
      'Up to 50 active listings',
      'Priority support',
      'Custom alerts',
    ],
    maxListings: 50
  },
  {
    name: 'Business',
    description: 'For established dealers',
    price: {
      early: 129,
      regular: 179
    },
    features: [
      'Up to 100 active listings',
      'Premium support',
      'Market insights',
      'Unlimited alerts',
    ],
    maxListings: 100
  },
  {
    name: 'Pro+ Unlimited',
    description: 'For serious dealers with large inventory',
    price: {
      early: 199,
      regular: 249
    },
    features: [
      'Unlimited active listings',
      '24/7 priority support',
    ],
    maxListings: null,
    highlighted: false
  }
]

export default function PricingPage() {
  return (
    <div className="container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your business. All plans include our core features with no hidden fees or commissions.
          </p>
        </div>

        {/* Early Bird Banner */}
        <div className="bg-primary/10 rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Early Bird Special</h2>
          <p className="text-muted-foreground">
            Join now and lock in our early-bird pricing forever. Limited spots available for founding members.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card rounded-lg border p-6 flex flex-col h-full ${
                plan.highlighted ? 'border-primary shadow-lg' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full w-fit mb-4">
                  Most Popular
                </div>
              )}
              <div className="flex-grow space-y-6">
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">€{plan.price.early}</span>
                    <span className="text-muted-foreground line-through">€{plan.price.regular}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button 
                className={`w-full mt-6 ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
              >
                Get Started
              </Button>
            </motion.div>
          ))}
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
                <p className="text-muted-foreground">You'll be notified when you're close to your limit. You can either upgrade your plan or archive some listings.</p>
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
      </motion.div>
    </div>
  )
} 