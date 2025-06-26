"use client"

import Head from "next/head"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Tag, 
  Globe, 
  Zap,
  User,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  X,
  MessageSquare,
  Eye,
  BarChart3,
  DollarSign
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthStatus } from "@/hooks/useAuthStatus"

const stats = [
  { number: "500+", label: "Verified Dealers", icon: Users },
  { number: "10,000+", label: "Listings", icon: Tag },
  { number: "50+", label: "Countries", icon: Globe },
  { number: "99.9%", label: "Uptime", icon: Zap }
]

const painPoints = [
  {
    icon: MessageSquare,
    title: "WhatsApp Groups Overwhelmed",
    description: "Too many messages, no filters, impossible to track conversations"
  },
  {
    icon: Eye,
    title: "Zero Visibility",
    description: "No clear info on availability, sellers, or listing performance"
  },
  {
    icon: BarChart3,
    title: "No B2B Management",
    description: "No interface to organize stock, track history, or set alerts"
  },
  {
    icon: X,
    title: "No Security Framework",
    description: "Anyone can pose as a dealer, no verification system"
  }
]

const solutions = [
  {
    icon: ShieldCheck,
    title: "Verified Professional Network",
    description: "Only KYC-verified dealers, clear profiles, real-time data"
  },
  {
    icon: TrendingUp,
    title: "Advanced Filters & Alerts",
    description: "Find exactly what you need, get notified instantly"
  },
  {
    icon: BarChart3,
    title: "Complete B2B Dashboard",
    description: "Track views, contacts, conversions, and performance"
  },
  {
    icon: DollarSign,
    title: "Zero Commission Model",
    description: "Monthly subscription only, keep 100% of your sales"
  }
]

const onboardingSteps = [
  {
    icon: User,
    title: "Create Account",
    description: "Sign up as a professional",
    link: "/auth?mode=register"
  },
  {
    icon: Briefcase,
    title: "Become Seller",
    description: "Register as verified dealer",
    link: "/seller/register"
  },
  {
    icon: ShieldCheck,
    title: "Get Verified",
    description: "Complete KYC verification",
    link: null
  },
  {
    icon: Tag,
    title: "Start Trading",
    description: "List and sell watches",
    link: "/sell"
  }
]

export function HowItWorks() {
  const { isAuthenticated, isSeller, isVerified, hasActiveSubscription } = useAuthStatus()
  
  return (
    <>
      <Head>
        <title>How it works – Watch Pros B2B Marketplace</title>
        <meta
          name="description"
          content="Discover Watch Pros: the B2B marketplace for luxury watches. Join 500+ verified dealers worldwide with zero commission fees."
        />
        <link rel="canonical" href="https://yourdomain.com/how-it-works" />
      </Head>

      <section className="py-12 sm:py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <Badge variant="secondary" className="mb-4 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium">
              <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Professional Solution
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-6 px-2">
              Replace WhatsApp Groups
              <span className="text-primary block">With Professional Tools</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto leading-relaxed px-4">
              Stop losing time in chaotic WhatsApp groups. Our platform provides the professional 
              tools you need to manage your B2B watch business efficiently.
            </p>
          </div>

          {/* Pain Points vs Solutions */}
          <div className="mb-16 sm:mb-20">
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

          {/* Stats Section */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 px-2">
              Platform Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              {stats.map((stat, i) => (
                <Card key={i} className="text-center group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Onboarding Process */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 px-2">
              Get Started in Minutes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {onboardingSteps.map((step, i) => {
                const isCompleted = [
                  isAuthenticated,
                  isSeller,
                  isVerified,
                  hasActiveSubscription
                ][i]
                
                return (
                  <Card key={i} className="relative group hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      {/* Step Number */}
                      <div className={`absolute -top-2 sm:-top-3 left-4 sm:left-6 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {i + 1}
                      </div>
                      
                      {/* Icon */}
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-green-500/10 text-green-600' 
                          : 'bg-primary/10 text-primary group-hover:scale-110'
                      }`}>
                        <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      
                      {/* Content */}
                      <h4 className="font-semibold mb-2 text-sm sm:text-base">{step.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{step.description}</p>
                      
                      {/* Status or Action */}
                      {isCompleted ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-sm font-medium">Completed</span>
                        </div>
                      ) : step.link ? (
                        <Link href={step.link} passHref>
                          <Button variant="link" className="p-0 h-auto text-primary font-medium text-xs sm:text-sm">
                            Get Started
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      ) : (
                        <span className="text-xs sm:text-sm text-muted-foreground">Pending</span>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Key Benefits */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 px-2">
              Why Professionals Choose Watch Pros
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Zero Commission</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Keep 100% of your sales with our transparent monthly subscription model. 
                    No hidden fees, no surprises.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Verified Network</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Every member undergoes professional KYC verification. 
                    Trade with confidence in a secure environment.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                    <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Global Reach</h4>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Connect with dealers and collectors from 50+ countries. 
                    Expand your business internationally.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 px-2">
                Ready to Replace WhatsApp Groups?
              </h3>
              <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 text-sm sm:text-base">
                Join 500+ verified dealers who've already switched to professional tools. 
                No setup fees, transparent pricing, and instant access to the global watch market.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Link href="/register" passHref className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold">
                    Create Professional Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/about" passHref className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base font-semibold">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
