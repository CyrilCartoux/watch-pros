"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Building2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function RegisterPage() {
  return (
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Register as a Professional on Watch Pros
          </h1>
          <p className="text-muted-foreground text-lg">
            Join our community of professionals and grow your business internationally
          </p>
        </motion.div>

        {/* Required Information */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-semibold">Required Information</h2>
              </div>
              
              <ul className="space-y-2">
                {[
                  "Company name and status",
                  "SIREN/SIRET number",
                  "Tax identification number",
                  "VAT number",
                  "Company address",
                  "Proof of address",
                  "ID document",
                  "Company logo",
                  "Contact information"
                ].map((item, index) => (
                  <motion.li 
                    key={index} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/50 rounded-lg p-6 mb-12"
        >
          <p className="text-muted-foreground">
            As Watch Pros is based in France, we must comply with current European legislation. This means we need certain information about your business to ensure a secure and compliant marketplace for all professionals.
          </p>
        </motion.div>

        {/* Conditions */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Acceptance Conditions</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              We can only accept your registration if you meet the following conditions:
            </p>
            <ul className="space-y-2">
              {[
                "You have a registered business or a company registered with the commercial register",
                "You are authorized to sell watches professionally",
                "You can provide all required documentation",
                "You agree to our terms of service and subscription conditions"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Please note that we reserve the right to refuse registrations. All subscriptions are billed monthly and can be cancelled at any time.
            </p>
          </CardContent>
        </Card>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link href="/register/form">
            <Button size="lg" className="px-8">
              Create my account
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}