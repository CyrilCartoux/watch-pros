"use client"

import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/SearchBar"
import Link from "next/link"
import { ArrowRight, Check, Users, Shield, Clock, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative pt-12 md:pt-16 min-h-[600px] md:min-h-[700px] flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Content */}
      <div className="relative container px-4 md:px-6 text-center">
        {/* Early Bird Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6"
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Early Bird Pricing - Limited Time Offer</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6"
        >
          The B2B platform for professional watch dealers
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-12 px-4 md:px-0"
        >
          Connect with verified professionals. No commission on sales. Simple monthly subscription.
        </motion.p>

        {/* Key Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8"
        >
          <div className="flex items-center gap-2 justify-center">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">100% B2B</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">No Commission</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Verified Dealers</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-card p-4 rounded-lg border">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-muted-foreground">Active Dealers</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">10k+</div>
            <div className="text-sm text-muted-foreground">Monthly Listings</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm text-muted-foreground">Verified Sellers</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
            <Link href="/sell" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Sell a watch
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                Create a pro account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* FOMO Message */}
          <div className="text-sm text-muted-foreground mt-4">
            <p>Join now and lock in our early-bird pricing forever. Limited spots available for founding members.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}