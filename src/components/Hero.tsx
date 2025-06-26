"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  ArrowRight, 
  Building2,
  Star,
  ShieldCheck,
  Zap,
  X,
  CheckCircle2
} from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStatus } from "@/hooks/useAuthStatus"

const painPoints = [
  {
    icon: X,
    title: "WhatsApp Groups Overwhelmed",
    description: "Too many messages, no filters, impossible to track"
  },
  {
    icon: X,
    title: "Zero Visibility on Your Watches",
    description: "No clear info on availability or sellers"
  },
  {
    icon: X,
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
    icon: CheckCircle2,
    title: "100% Professional Platform",
    description: "Verified dealers only, clear profiles, real-time data"
  },
  {
    icon: CheckCircle2,
    title: "Save Time & Increase Sales",
    description: "Advanced filters, personalized alerts, performance tracking"
  },
  {
    icon: CheckCircle2,
    title: "Control Your B2B Activity",
    description: "Statistics, history, reputation-based ranking"
  },
  {
    icon: CheckCircle2,
    title: "Zero Commission, Direct Deals",
    description: "Monthly subscription only, no intermediaries"
  }
]

export function Hero() {
  const { isAuthenticated } = useAuthStatus()
  
  return (
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

          {/* Pain Points vs Solutions */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 sm:mb-16"
          >
            {/* Pain Points */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-red-600 mb-4">
                ❌ Current Professional Dealer Problems
              </h3>
              <div className="space-y-3">
                {painPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-50/50 border border-red-200/50">
                    <point.icon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <h4 className="font-medium text-sm sm:text-base">{point.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-green-600 mb-4">
                ✅ What Watch Pros Changes for You
              </h3>
              <div className="space-y-3">
                {solutions.map((solution, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 border border-green-200/50">
                    <solution.icon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <h4 className="font-medium text-sm sm:text-base">{solution.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{solution.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4"
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
            <Link href="/listings" passHref className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Browse Listings
              </Button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-muted-foreground px-4"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">4.9/5 Rating</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="text-sm">24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
