"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Building2, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/useAuthGuard"

export default function RegisterPage() {
  const { isAuthorized, isLoading: isAuthLoading } = useAuthGuard({
    requireAuth: true,
    requireSeller: false  ,
    requireVerified: false
  })
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    )
  }
  return (
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
                <h3 className="font-semibold text-lg">Start your trial period</h3>
              </div>
              <p className="text-muted-foreground">
                Once your data and documents are verified, you can start your trial period. Post listings and sell your watches worldwide.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Legal Information */}
        <div className="bg-muted/50 rounded-lg p-6 mb-12">
          <p className="text-muted-foreground mb-6">
            As Watch Pros is based in Germany, we must comply with current European legislation. This means we need certain information about your business. This way, you can focus entirely on selling your watches during your trial period.
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
                  "Business registration number",
                  "Business registration extract",
                  "Tax identification number",
                  "VAT number",
                  "Bank details for payments",
                  "Proof of address",
                  "ID document",
                  "Legal status",
                  "Chrono24 shareholder declaration",
                  "DAC 7: required data",
                  "VAT information"
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
                  "Tax identification number",
                  "VAT number",
                  "Bank details for payments",
                  "Proof of address",
                  "ID document",
                  "Professional activity declaration",
                  "DAC 7: required data",
                  "VAT information"
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
                "Your inventory includes at least 50 watches",
                "50 of your watches cost at least €2,000 each"
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Please note that we reserve the right to refuse registrations.
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
  )
}