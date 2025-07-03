"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Building2,
  Star,
  ShieldCheck,
  Zap,
  X,
  CheckCircle2,
  Users, 
  Tag, 
  Globe,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Eye,
  BarChart3,
  PlusCircle,
  User,
  Briefcase,
  Clock,
  Target,
  Award,
  Heart
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuthStatus } from "@/hooks/useAuthStatus"
import { PlacesLeft } from "@/components/PlacesLeft"
import { useEffect, useState } from "react"
import { ListingCard } from "@/components/ListingCard"
import Image from "next/image"


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
    title: "100% Professional Platform",
    description: "Only KYC-verified dealers, clear profiles, real-time data"
  },
  {
    icon: TrendingUp,
    title: "Advanced Filters & Alerts",
    description: "Find exactly what you need, get notified instantly"
  },
  {
    icon: BarChart3,
    title: "B2B Dashboard",
    description: "Track views, contacts, conversions, and performance"
  },
  {
    icon: DollarSign,
    title: "Zero Commission",
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

const benefits = [
  {
    icon: TrendingUp,
    title: "Zero Commission",
    description: "Keep 100% of your sales with our transparent monthly subscription model. No hidden fees, no surprises.",
    color: "emerald"
  },
  {
    icon: ShieldCheck,
    title: "Verified Network",
    description: "Every member undergoes professional KYC verification. Trade with confidence in a secure environment.",
    color: "blue"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Connect with dealers and collectors from 50+ countries. Expand your business internationally.",
    color: "purple"
  }
]

// Utility: display "X minutes/hours ago" in English
function timeAgo(dateString: string) {
  const now = new Date()
  const date = new Date(dateString)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return `${diff} sec. ago`
  if (diff < 3600) return `${Math.floor(diff / 60)} min. ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h. ago`
  return `${Math.floor(diff / 86400)} d. ago`
}

function getCountryFlag(countryCode: string) {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function SellerMiniCard({ seller }: { seller: any }) {
  return (
    <div className="relative flex flex-col items-center p-2 rounded-xl bg-white border border-muted shadow w-full max-w-xs mx-auto">
      {/* Badge New */}
      <span className="absolute top-1 right-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">NEW</span>
      {/* Logo/photo */}
      <div className="w-10 h-10 rounded-full overflow-hidden border bg-muted flex items-center justify-center mb-1">
        {seller.company_logo_url ? (
          <Image src={seller.company_logo_url} alt={seller.company_name} width={40} height={40} className="object-cover w-full h-full" />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">{seller.company_name.charAt(0)}</span>
        )}
      </div>
      {/* Nom vendeur */}
      <div className="font-medium text-sm truncate text-center w-full">{seller.watch_pros_name}</div>
      {/* Company */}
      <div className="text-xs text-muted-foreground truncate text-center w-full">{seller.company_name}</div>
      {/* Pays avec drapeau */}
      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-0.5">
        <span>{getCountryFlag(seller.country)}</span>
        <span>{seller.country}</span>
      </div>
    </div>
  )
}

export default function Home() {
  const { isAuthenticated, isSeller, isVerified, hasActiveSubscription } = useAuthStatus()
  
  const [latest, setLatest] = useState<{ latestListing: any, latestSeller: any } | null>(null)
  const [loadingLatest, setLoadingLatest] = useState(true)

  useEffect(() => {
    const fetchLatest = async () => {
      setLoadingLatest(true)
      try {
        const res = await fetch("/api/activity/latest")
        if (!res.ok) throw new Error("Failed to fetch latest activity")
        const data = await res.json()
        setLatest(data)
      } catch {
        setLatest(null)
      } finally {
        setLoadingLatest(false)
      }
    }
    fetchLatest()
    // Optionally, refresh every hour
    const interval = setInterval(fetchLatest, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] sm:bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        <div className="container relative z-10 px-4 py-8 sm:py-20">
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 sm:mb-8"
            >
              <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border-primary/20 bg-primary/5">
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                B2B Professional Network
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 sm:mb-8 leading-[0.9] px-2"
            >
              <span className="text-foreground">Stop the WhatsApp</span>
              <br />
              <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Chaos
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
            >
              Join the professional B2B marketplace that replaces WhatsApp groups. 
              <span className="font-semibold text-foreground"> Verified dealers only. Zero commission.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center mb-6 sm:mb-8 px-4"
            >
              <Link href={isAuthenticated ? "/seller/register" : "/auth?mode=register"} passHref className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-300 group"
                >
                  {isAuthenticated ? "Register as Seller" : "Join the Network"}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Last seller joined (FOMO B2B, compact, centered) */}
            <div className="flex justify-center mb-8">
              {loadingLatest ? (
                <div className="w-full h-20 bg-muted animate-pulse rounded-lg max-w-xs" />
              ) : latest?.latestSeller ? (
                <div className="w-full max-w-xs text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-primary font-semibold mb-1">
                    <span role="img" aria-label="new">🆕</span> Just joined!
                  </div>
                  <SellerMiniCard seller={latest.latestSeller} />
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {timeAgo(latest.latestSeller.created_at)}
                  </div>
                  <div className="text-[11px] text-amber-600 mt-1 font-medium">A new professional dealer joined the network. <span className="font-bold">Don't miss out!</span></div>
                </div>
              ) : null}
            </div>

          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-4 sm:py-8 md:py-12 bg-gradient-to-b from-background to-muted/30">
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
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Pain Points */}
              <div className="space-y-4">
                <h4 className="text-lg sm:text-xl font-semibold text-red-600 text-center mb-4">❌ Current Professional Dealers Problems</h4>
                {painPoints.map((point, i) => (
                  <Card key={i} className="border-red-200/50 bg-red-50/30 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                          <point.icon className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
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

              {/* Solutions */}
              <div className="space-y-4">
                <h4 className="text-lg sm:text-xl font-semibold text-green-600 text-center mb-4">✅ What Watch Pros® Changes for you</h4>
                {solutions.map((solution, i) => (
                  <Card key={i} className="border-green-200/50 bg-green-50/30 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                          <solution.icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
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

          {/* Pricing Section */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 px-2">
              Simple, Transparent Pricing
            </h3>
            <p className="text-lg sm:text-xl text-muted-foreground text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
              Choose the plan that fits your business needs. No hidden fees, no surprises.
            </p>

            {/* Pioneer Badge for Subscribers (PlacesLeft) */}
            <div className="flex justify-center mt-8 mb-8">
              <PlacesLeft />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <Card className="border-2 border-border hover:border-primary/40 transition-all duration-300 group h-full flex flex-col">
                <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full">
                  <div className="mb-6">
                    <h4 className="text-xl sm:text-2xl font-bold mb-2">Monthly Plan</h4>
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">€59</div>
                    <div className="text-muted-foreground">per month</div>
                  </div>
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>No commitment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Unlimited listings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                  <Link href="/subscription" passHref className="w-full mt-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      Start Monthly Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              {/* Annual Plan */}
              <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary/40 transition-all duration-300 group relative h-full flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                    BEST VALUE
                  </Badge>
                </div>
                <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full">
                  <div className="mb-6">
                    <h4 className="text-xl sm:text-2xl font-bold mb-2">Annual Plan</h4>
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">€599</div>
                    <div className="text-muted-foreground mb-2">per year</div>
                    <div className="text-sm text-green-600 font-semibold">
                      Save €109 (2 months free)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Only €49.9/month
                    </div>
                  </div>
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>2 months free</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Unlimited listings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Priority support</span>
                    </div>
                  </div>
                  <Link href="/subscription" passHref className="w-full mt-auto">
                    <Button
                      size="lg"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start Annual Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            {/* Last listing posted (FOMO B2B, compact, centered) */}
            <div className="flex justify-center mt-6">
              {loadingLatest ? (
                <div className="w-full h-40 bg-muted animate-pulse rounded-lg max-w-xs" />
              ) : latest?.latestListing ? (
                <div className="w-full max-w-xs text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-primary font-semibold mb-1">
                    <span role="img" aria-label="clock">⏰</span> Just listed!
                  </div>
                  <ListingCard listing={latest.latestListing} isFavorite={false} onFavoriteClick={() => {}} />
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {timeAgo(latest.latestListing.created_at)}
                  </div>
                  <div className="text-[11px] text-amber-600 mt-1 font-medium">A new watch was just listed. <span className="font-bold">Don't miss the latest deals!</span></div>
                </div>
              ) : null}
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
              Why Professionals Choose Watch Pros®
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {benefits.map((benefit, i) => (
                <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6 sm:p-8 text-center">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-${benefit.color}-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                      <benefit.icon className={`w-6 h-6 sm:w-8 sm:h-8 text-${benefit.color}-600`} />
                    </div>
                    <h4 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{benefit.title}</h4>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Cards */}
          <div className="mb-16 sm:mb-20">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-8 sm:mb-12 px-2">
              Ready to Scale Your Watch Business?
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
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

                  <Link href={isAuthenticated ? "/seller/register" : "/auth?mode=register"} passHref className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold group-hover:shadow-lg transition-all duration-300"
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

                  <Link href="/sell/watch" passHref className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                    >
                      Post Listing
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          

          {/* Final CTA Section */}
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

          {/* Social Proof */}
          <div className="text-center mt-12 px-4">
            <p className="text-base sm:text-lg text-muted-foreground mb-2">
              Already trusted by <strong className="text-foreground">500+</strong> professional sellers worldwide
            </p>
            <p className="text-sm text-muted-foreground">
              Join the fastest-growing B2B watch marketplace
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
