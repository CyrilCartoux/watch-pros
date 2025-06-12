"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Building2, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"


export default function RegisterPage() {
  return (
    <ProtectedRoute requireAuth>
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Register as a Professional on Watch Pros
          </h1>
          <p className="text-muted-foreground text-lg">
            Join our community of professionals and grow your business internationally
          </p>
        </div>

        {/* Registration Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <h3 className="font-semibold text-lg">Create your professional account</h3>
              </div>
              <p className="text-muted-foreground">
                Start by setting up your platform access credentials, then submit some essential information about your business and register your banking details.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <h3 className="font-semibold text-lg">Complete your information</h3>
              </div>
              <p className="text-muted-foreground">
                Before starting, we need a few more documents about you and your business. We'll also check together which tax identification numbers need to be provided.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <h3 className="font-semibold text-lg">Choose your subscription plan</h3>
              </div>
              <p className="text-muted-foreground">
                Select the subscription plan that best fits your needs. Start posting listings and selling your watches worldwide immediately after verification.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Legal Information */}
        <div className="bg-muted/50 rounded-lg p-6 mb-12">
          <p className="text-muted-foreground mb-6">
            As Watch Pros is based in France, we must comply with current European legislation. This means we need certain information about your business to ensure a secure and compliant marketplace for all professionals.
          </p>
        </div>

        {/* Required Documents */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Legal Entity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Legal Entity</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Legal Entity / Corporation</p>
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
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Individual */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Individual</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Individual / Sole Proprietor</p>
              <ul className="space-y-2">
                {[
                  "Full name and title",
                  "Tax identification number",
                  "VAT number",
                  "Business address",
                  "Proof of address",
                  "ID document",
                  "Contact information",
                  "Professional activity declaration",
                  "Company logo (optional)"
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

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
        <div className="text-center">
          <Link href="/register/form">
            <Button size="lg" className="px-8">
              Create my account
            </Button>
          </Link>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  )
}