'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
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
          <h1 className="text-4xl font-bold">Help & Contact</h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about Watch Pros and how to get in touch with us.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">About the Platform</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is">
                <AccordionTrigger>What is Watch Pros?</AccordionTrigger>
                <AccordionContent>
                  Watch Pros is a 100% B2B platform connecting professional watch dealers. Our goal is simple: to facilitate exchanges between verified professionals in a clear, fast, and reliable manner.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="who-can-join">
                <AccordionTrigger>Who can register?</AccordionTrigger>
                <AccordionContent>
                  Only professionals in the watch industry can access the platform (dealers, jewelers, brokers, etc.). Each registration is subject to verification (Kbis extract, SIRET number, etc.).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="private-access">
                <AccordionTrigger>Is the platform open to private individuals?</AccordionTrigger>
                <AccordionContent>
                  No. This is a platform strictly reserved for professionals. Listings, prices, and profiles are only visible to certified dealers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Listings & Operation</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="how-to-list">
                <AccordionTrigger>How to publish a watch?</AccordionTrigger>
                <AccordionContent>
                  Once your account is validated, you can publish your products from your professional space: brand, model, reference, year, price, HD photos, availability, etc.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="edit-listing">
                <AccordionTrigger>Can I modify a listing?</AccordionTrigger>
                <AccordionContent>
                  Yes, all your listings can be modified at any time from your dashboard.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="accessories">
                <AccordionTrigger>Can I publish accessories or spare parts?</AccordionTrigger>
                <AccordionContent>
                  Yes. You can select the product type: Watch / Accessory / Spare part.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Payments & Fees</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="payment-handling">
                <AccordionTrigger>Does the platform handle payments?</AccordionTrigger>
                <AccordionContent>
                  No, Watch Pros is a connection platform. Payments are made directly between dealers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="commission">
                <AccordionTrigger>Do you take a commission on sales?</AccordionTrigger>
                <AccordionContent>
                  No. The business model is based on a monthly subscription. You keep 100% of your sales.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="subscription-cost">
                <AccordionTrigger>How much does the subscription cost?</AccordionTrigger>
                <AccordionContent>
                  The price depends on the chosen plan. We offer an early-access offer starting at XX €/month for the first dealers. [Link to pricing]
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Security & Verification</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="seller-quality">
                <AccordionTrigger>How do you guarantee seller quality?</AccordionTrigger>
                <AccordionContent>
                  Each professional is verified manually or through an automated process (pro KYC). We filter registrations to ensure a serious and secure environment.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="listing-moderation">
                <AccordionTrigger>Are listings moderated?</AccordionTrigger>
                <AccordionContent>
                  Yes, we perform consistency checks and may suspend any suspicious or non-compliant listings.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Features & Tools</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="alerts">
                <AccordionTrigger>Can I create alerts?</AccordionTrigger>
                <AccordionContent>
                  Yes. You can be notified when a specific model is listed for sale or when a favorite changes price or is sold.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="stats">
                <AccordionTrigger>Can I see my listing statistics?</AccordionTrigger>
                <AccordionContent>
                  Of course. You have access to views, contacts, click-through rates, and more in your dashboard.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="boost">
                <AccordionTrigger>Can I boost my listings?</AccordionTrigger>
                <AccordionContent>
                  This is under development. You will soon be able to feature your listings (paid option).
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        {/* Contact Form */}
        <section className="bg-card rounded-lg p-6 border">
          <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
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
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </section>

        {/* Additional Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <a href="/terms" className="text-muted-foreground hover:text-primary">
            Terms of Service
          </a>
          <a href="/privacy" className="text-muted-foreground hover:text-primary">
            Privacy Policy
          </a>
          <a href="/pricing" className="text-muted-foreground hover:text-primary">
            Pricing
          </a>
        </div>
      </motion.div>
    </div>
  )
} 