'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpPage() {
  const [formData, setFormData] = useState({
    subject: '',
    email: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast({
        title: "Success",
        description: "Message sent successfully!",
      })
      setFormData({ subject: '', email: '', message: '' })
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12"
      >
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Welcome to Watch Pros®, the leading B2B marketplace for luxury watch professionals. Here you'll find everything you need to get started, maximize your experience, and get in touch with our team.
          </p>
        </div>

        {/* Platform Overview */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">About Watch Pros®</h2>
            <p className="mb-4 text-muted-foreground">
              Watch Pros® is a secure, invitation-only B2B platform designed exclusively for professional watch dealers, jewelers, and brokers. Our mission is to streamline the way professionals connect, trade, and grow their business globally—without the chaos of WhatsApp groups or the risks of unverified marketplaces.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>100% B2B: Only verified professionals can join and access listings.</li>
              <li>Zero Commission: Keep 100% of your sales. Transparent monthly subscription.</li>
              <li>Global Network: Connect with trusted dealers in 50+ countries.</li>
              <li>Advanced Tools: Dashboard, statistics, alerts, messaging, and more.</li>
              <li>Security First: KYC verification, listing moderation, and encrypted data.</li>
            </ul>
          </section>

          {/* Features Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="dashboard">
                <AccordionTrigger>Professional Dashboard</AccordionTrigger>
                <AccordionContent>
                  Manage your listings, track performance, and monitor your business at a glance. Access real-time statistics on views, contacts, sales, and conversion rates.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="alerts">
                <AccordionTrigger>Custom Alerts & Active Searches</AccordionTrigger>
                <AccordionContent>
                  Set up personalized alerts for specific models, brands, or price changes. Create active searches to let the network know what you're looking for and receive direct offers from other professionals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="messaging">
                <AccordionTrigger>Secure Messaging</AccordionTrigger>
                <AccordionContent>
                  Communicate directly with other verified dealers via our integrated messaging system. Set your contact preferences (email, phone, WhatsApp) and keep all your B2B conversations organized.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="verification">
                <AccordionTrigger>Dealer Verification & Security</AccordionTrigger>
                <AccordionContent>
                  Every member undergoes a strict KYC process. Only certified professionals can access the platform. Listings are moderated to ensure quality and compliance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="global">
                <AccordionTrigger>International Reach</AccordionTrigger>
                <AccordionContent>
                  Expand your business with access to a global network of trusted professionals. List in multiple currencies, set your location, and connect with buyers and sellers worldwide.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="subscription">
                <AccordionTrigger>Subscription & Pricing</AccordionTrigger>
                <AccordionContent>
                  Enjoy unlimited access to all features for a simple monthly or annual fee. No hidden costs, no commission on sales. See our <a href="/subscription" className="text-primary underline">pricing page</a> for details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Onboarding & Usage */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="who-can-join">
                <AccordionTrigger>Who can join Watch Pros®?</AccordionTrigger>
                <AccordionContent>
                  Only professionals in the watch industry (dealers, jewelers, brokers, etc.) are eligible. Each application is reviewed and verified for authenticity and compliance.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="register">
                <AccordionTrigger>How do I register and get verified?</AccordionTrigger>
                <AccordionContent>
                  Click <a href="/auth?mode=register" className="text-primary underline">here</a> to start your registration. You'll be asked to provide business credentials (company registration, VAT, etc.). Our team will review your application and notify you upon approval.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="listings">
                <AccordionTrigger>How do I list a watch or accessory?</AccordionTrigger>
                <AccordionContent>
                  Once verified, you can create listings from your dashboard. Add detailed information (brand, model, reference, year, price, photos, etc.) and publish instantly to the network.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="edit-listing">
                <AccordionTrigger>Can I edit or remove my listings?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can update or remove your listings at any time from your dashboard. All changes are reflected in real time.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="accessories">
                <AccordionTrigger>Can I list accessories or spare parts?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. Select the appropriate product type (Watch / Accessory / Spare Part) when creating your listing.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Security & Compliance */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Security & Compliance</h2>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="kyc">
                <AccordionTrigger>How does Watch Pros® ensure security?</AccordionTrigger>
                <AccordionContent>
                  All members are KYC-verified. Listings are moderated, and suspicious activity is monitored. Your data is encrypted and never shared with third parties.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="moderation">
                <AccordionTrigger>Are listings moderated?</AccordionTrigger>
                <AccordionContent>
                  Yes, our team reviews listings for accuracy and compliance. Non-compliant or suspicious listings may be suspended or removed.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="privacy">
                <AccordionTrigger>Is my information private?</AccordionTrigger>
                <AccordionContent>
                  Yes. Only verified members can view your listings and profile. We never share your data outside the platform. See our <a href="/terms/privacy" className="text-primary underline">Privacy Policy</a> for more details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* FAQ: Payments & Fees */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Payments & Fees</h2>
            <Accordion type="multiple" className="w-full">
              <AccordionItem value="payments">
                <AccordionTrigger>Does Watch Pros® handle payments?</AccordionTrigger>
                <AccordionContent>
                  No. All transactions are conducted directly between professionals. Watch Pros® does not act as an intermediary or escrow.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="commission">
                <AccordionTrigger>Are there any commissions or hidden fees?</AccordionTrigger>
                <AccordionContent>
                  Never. Our business model is based solely on a transparent subscription. You keep 100% of your sales revenue.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pricing">
                <AccordionTrigger>How much does the subscription cost?</AccordionTrigger>
                <AccordionContent>
                  See our <a href="/subscription" className="text-primary underline">pricing page</a> for current offers. Early-bird rates are available for a limited time.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        {/* Contact Form */}
        <section className="bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
          <p className="mb-4 text-muted-foreground">
            Can't find the answer you're looking for? Our team is here to help. Fill out the form below and we'll get back to you as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="min-h-[150px]"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </section>

        {/* Additional Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <a href="/terms" className="text-muted-foreground hover:text-primary">
            Terms of Service
          </a>
          <a href="/terms/privacy" className="text-muted-foreground hover:text-primary">
            Privacy Policy
          </a>
          <a href="/subscription" className="text-muted-foreground hover:text-primary">
            Pricing
          </a>
        </div>
      </motion.div>
    </div>
  )
} 