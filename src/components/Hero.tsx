"use client"

import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/SearchBar"
import Link from "next/link"
import { ArrowRight, Check, Users, Shield, Clock, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section 
      aria-label="Hero section – Luxury B2B Watch Marketplace"
      className="relative pt-8 md:pt-16 min-h-[500px] md:min-h-[700px] flex flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background"
    >
      {/* — Badge Early Bird */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-1.5 md:gap-2 bg-primary/10 text-primary px-3 md:px-4 py-1.5 md:py-2 rounded-full mb-4 md:mb-6"
      >
        <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" aria-hidden="true"/>
        <span className="text-xs md:text-sm font-medium">Early Bird Pricing – Limited Time Offer</span>
      </motion.div>

      {/* — Titre principal optimisé */}
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-5xl font-bold tracking-tight mb-3 md:mb-6 text-center px-4"
      >
        Luxury B2B Watch Marketplace
      </motion.h1>

      {/* — Paragraphe transformé en listes pour la lisibilité */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-12 px-4 md:px-0"
      >
        <p className="mb-1.5 md:mb-2"><strong>✓ Connect with verified professionals</strong></p>
        <p className="mb-1.5 md:mb-2"><strong>✓ Keep 100 % of your sales – no commission</strong></p>
        <p><strong>✓ Simple monthly subscription</strong></p>
      </motion.div>

      {/* — Section "Key Benefits" structurée */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto mb-6 md:mb-8 px-4 md:px-0"
      >
        <h2 className="text-lg md:text-2xl font-semibold mb-3 md:mb-4 text-center">Key Benefits</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 list-none">
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 md:h-5 md:w-5 text-primary" aria-hidden="true"/>
            <span className="text-xs md:text-sm font-medium">100 % B2B platform</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 md:h-5 md:w-5 text-primary" aria-hidden="true"/>
            <span className="text-xs md:text-sm font-medium">No commission on sales</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-4 w-4 md:h-5 md:w-5 text-primary" aria-hidden="true"/>
            <span className="text-xs md:text-sm font-medium">Only verified dealers</span>
          </li>
        </ul>
      </motion.div>

      {/* — Section "Our Impact" */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto mb-8 md:mb-12 px-4 md:px-0"
      >
        <h2 className="text-lg md:text-2xl font-semibold mb-4 md:mb-6 text-center">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {/* Statistiques avec aria-label pour accessibilité */}
          <div className="bg-card p-3 md:p-4 rounded-lg border" aria-label="500+ Active Dealers">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1.5 md:mb-2" aria-hidden="true"/>
            <div className="text-lg md:text-2xl font-bold">500+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Active Dealers</div>
          </div>
          <div className="bg-card p-3 md:p-4 rounded-lg border" aria-label="10 k+ Monthly Listings">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1.5 md:mb-2" aria-hidden="true"/>
            <div className="text-lg md:text-2xl font-bold">10 k+</div>
            <div className="text-xs md:text-sm text-muted-foreground">Monthly Listings</div>
          </div>
          <div className="bg-card p-3 md:p-4 rounded-lg border" aria-label="100 % Verified Sellers">
            <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1.5 md:mb-2" aria-hidden="true"/>
            <div className="text-lg md:text-2xl font-bold">100 %</div>
            <div className="text-xs md:text-sm text-muted-foreground">Verified Sellers</div>
          </div>
          <div className="bg-card p-3 md:p-4 rounded-lg border" aria-label="24/7 Support">
            <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary mx-auto mb-1.5 md:mb-2" aria-hidden="true"/>
            <div className="text-lg md:text-2xl font-bold">24/7</div>
            <div className="text-xs md:text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </motion.div>

      {/* — CTA Principaux */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-4xl mx-auto space-y-3 md:space-y-4 px-4 md:px-0"
      >
        <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-4">
          <Link href="/sell" passHref className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2 h-11 md:h-12" 
              title="Start Selling Now" 
              aria-label="Start Selling Now"
            >
              Start Selling Now
              <ArrowRight className="w-4 h-4" aria-hidden="true"/>
            </Button>
          </Link>
          <Link href="/register" passHref className="w-full sm:w-auto">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto gap-2 h-11 md:h-12" 
              title="Create Your Pro Account" 
              aria-label="Create Your Pro Account"
            >
              Create Your Pro Account
              <ArrowRight className="w-4 h-4" aria-hidden="true"/>
            </Button>
          </Link>
        </div>

        {/* FOMO renforcé */}
        <div className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4 text-center">
          <p>Join now and lock in our early-bird pricing forever. Only a few spots left!</p>
        </div>
      </motion.div>
    </section>
  )
}
