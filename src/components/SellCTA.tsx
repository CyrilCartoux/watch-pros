"use client"

import Head from "next/head"                            
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  PlusCircle, 
  ArrowRight,
  DollarSign,
  Users,
  Globe,
  CheckCircle2,
  X,
  MessageSquare,
  Eye,
  BarChart3,
  ShieldCheck
} from "lucide-react"   
import Link from "next/link"
import { useAuthStatus } from "@/hooks/useAuthStatus"

interface SellCTAProps {
  className?: string
}

const painPoints = [
  {
    icon: MessageSquare,
    title: "WhatsApp Groups Overwhelmed",
    description: "Too many messages, no filters, impossible to track"
  },
  {
    icon: Eye,
    title: "Zero Visibility on Your Watches",
    description: "No clear info on availability or sellers"
  },
  {
    icon: BarChart3,
    title: "No B2B Stock Management",
    description: "No clear interface, no history or alerts"
  },
  {
    icon: X,
    title: "No Secure Professional Framework",
    description: "No serious verification, anyone can pose as a dealer"
  }
]

const solutions = [
  {
    icon: ShieldCheck,
    title: "100% Professional Platform",
    description: "Verified dealers only, clear profiles, real-time data"
  },
  {
    icon: TrendingUp,
    title: "Save Time & Increase Sales",
    description: "Advanced filters, personalized alerts, performance tracking"
  },
  {
    icon: BarChart3,
    title: "Control Your B2B Activity",
    description: "Statistics, history, reputation-based ranking"
  },
  {
    icon: DollarSign,
    title: "Zero Commission, Direct Deals",
    description: "Monthly subscription only, no intermediaries"
  }
]

export function SellCTA({ className = "" }: SellCTAProps) {
  const { isAuthenticated, isSeller } = useAuthStatus()

  return (
    <>
      <Head>
        <title>Sell Your Luxury Watches | Join Watch Pros B2B Marketplace</title>
        <meta
          name="description"
          content="Join Watch Pros, the B2B marketplace for luxury watches: no commission, verified sellers and global visibility. Start selling today!"
        />
        <link rel="canonical" href="https://votresite.com/sell" />
      </Head>

      <section className={`py-12 sm:py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-muted/30 ${className}`} aria-labelledby="sell-cta-title">
        <div className="container">
          <div className="max-w-5xl sm:max-w-6xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16">
              <Badge variant="secondary" className="mb-4 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Stop WhatsApp Chaos
              </Badge>
              <h2 id="sell-cta-title" className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 px-2">
                Ready to Scale Your
                <span className="text-primary block">Watch Business?</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4">
                Join the professional B2B marketplace that replaces WhatsApp groups. Connect with verified dealers worldwide, 
                keep 100% of your sales, and grow your business globally.
              </p>
            </div>

            {/* Pain Points vs Solutions */}
            <div className="mb-12 sm:mb-16">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 px-2">
                The Problem vs The Solution
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pain Points */}
                <div className="space-y-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-red-600 mb-6 text-center">
                    ❌ Current WhatsApp Group Problems
                  </h4>
                  <div className="space-y-4">
                    {painPoints.map((point, i) => (
                      <Card key={i} className="border-red-200/50 bg-red-50/30 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                              <point.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold mb-1 text-sm sm:text-base">{point.title}</h5>
                              <p className="text-xs sm:text-sm text-muted-foreground">{point.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Solutions */}
                <div className="space-y-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-green-600 mb-6 text-center">
                    ✅ Watch Pros Solutions
                  </h4>
                  <div className="space-y-4">
                    {solutions.map((solution, i) => (
                      <Card key={i} className="border-green-200/50 bg-green-50/30 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                              <solution.icon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold mb-1 text-sm sm:text-base">{solution.title}</h5>
                              <p className="text-xs sm:text-sm text-muted-foreground">{solution.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Zero Commission</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Keep 100% of your sales. No hidden fees, no surprises. 
                    Transparent monthly subscription only.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Verified Network</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Trade with 500+ verified dealers worldwide. 
                    Every member is KYC verified for your security.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Global Reach</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Access buyers from 50+ countries. 
                    Expand your market reach instantly.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-12">
              {/* Create Account Card */}
              <Card className="shadow-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold">Create Professional Account</h3>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Join our B2B platform and start your journey
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Instant account activation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Professional verification process</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Access to global network</span>
                    </div>
                  </div>

                  <Link href={isAuthenticated ? "/seller/register" : "/auth?mode=register"} passHref className="block">
                    <Button
                      size="lg"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold group-hover:shadow-lg transition-all duration-300"
                      title="Start Selling Luxury Watches"
                      aria-label="Start Selling Luxury Watches"
                    >
                      {isAuthenticated ? "Register as Seller" : "Create Account"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Post Listing Card */}
              <Card className="shadow-xl border-2 border-border hover:border-primary/40 transition-all duration-300 group">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                      <PlusCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold">Post Your First Listing</h3>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        List your watches in just a few clicks
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Detailed listing creation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Professional presentation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Instant global visibility</span>
                    </div>
                  </div>

                  <Link href="/sell" passHref className="block">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      title="Post Your First Listing"
                      aria-label="Post Your First Listing"
                    >
                      Post Listing
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Social Proof */}
            <div className="text-center px-4">
              <p className="text-base sm:text-lg text-muted-foreground mb-2">
                Already trusted by <strong className="text-foreground">500+</strong> professional sellers worldwide
              </p>
              <p className="text-sm text-muted-foreground">
                Join the fastest-growing B2B watch marketplace
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
