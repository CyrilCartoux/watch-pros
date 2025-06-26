"use client"

import Head from "next/head"                         // For SEO metadata
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Clock, Shield, Truck, CreditCard, Users, Search, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "./ui/use-toast"

const navigation = {
  marketplace: [
    { name: "Browse Watches", href: "/listings?listingType=watch", icon: Search },
    { name: "Browse Accessories", href: "/listings?listingType=accessory", icon: Search },
    { name: "Active Searches", href: "/searches", icon: Eye },
    { name: "Sellers Directory", href: "/sellers", icon: Users },
    { name: "Brands", href: "/brands", icon: Search },
    { name: "Models", href: "/models", icon: Search },
  ],
  sell: [
    { name: "Sell a Watch", href: "/sell/watch", icon: Plus },
    { name: "Sell an Accessory", href: "/sell/accessory", icon: Plus },
    { name: "Create Active Search", href: "/searches", icon: Eye },
    { name: "Become a Seller", href: "/sellers/register", icon: Users },
  ],
  support: [
    { name: "Help Center", href: "/help", icon: Mail },
    { name: "Contact Us", href: "/help", icon: Phone },
    { name: "About Us", href: "/about", icon: Users },
    { name: "FAQ", href: "/help", icon: Mail },
  ],
  legal: [
    { name: "Privacy Policy", href: "/terms/privacy", icon: Shield },
    { name: "Terms of Service", href: "/terms", icon: Shield },
    { name: "Sales Terms", href: "/terms/sales", icon: Shield },
    { name: "Cookie Policy", href: "/terms/privacy", icon: Shield },
  ],
  features: [
    { name: "Secure Transactions", icon: Shield },
    { name: "Worldwide Shipping", icon: Truck },
    { name: "Multiple Payment Methods", icon: CreditCard },
    { name: "Verified Sellers", icon: Users },
  ],
  social: [
    { name: "Facebook", href: "https://facebook.com/WatchPros", icon: Facebook },
    { name: "Instagram", href: "https://instagram.com/WatchPros", icon: Instagram },
    { name: "Twitter", href: "https://twitter.com/WatchPros", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/WatchPros", icon: Linkedin },
  ],
}

export function Footer() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred')
      }

      toast({
        title: "Success",
        description: "Thank you for subscribing to our newsletter!"
      })
      setEmail("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <footer role="contentinfo" className="bg-muted/50 border-t">
        <div className="container py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Branding & Description */}
            <div className="lg:col-span-1 space-y-6">
              <Link href="/" className="inline-block">
                <h2 className="text-2xl font-bold">Watch Pros</h2>
              </Link>
              <p className="text-muted-foreground leading-relaxed">
                The premier B2B marketplace for luxury watches. Connect with trusted dealers and collectors worldwide for secure, professional transactions.
              </p>
              
              {/* Features */}
              <div className="space-y-3">
                {navigation.features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-3 text-sm">
                    <feature.icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{feature.name}</span>
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-3">
                  {navigation.social.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      rel="noopener noreferrer"
                      target="_blank"
                      aria-label={item.name}
                    >
                      <item.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Marketplace */}
            <nav aria-label="Marketplace navigation">
              <h3 className="text-sm font-semibold mb-4">Marketplace</h3>
              <ul className="space-y-3">
                {navigation.marketplace.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sell & Support */}
            <div className="space-y-8">
              <nav aria-label="Sell navigation">
                <h3 className="text-sm font-semibold mb-4">Sell</h3>
                <ul className="space-y-3">
                  {navigation.sell.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Support navigation">
                <h3 className="text-sm font-semibold mb-4">Support</h3>
                <ul className="space-y-3">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Newsletter & Legal */}
            <div className="space-y-8">
              {/* Newsletter */}
              <div>
                <h3 className="text-sm font-semibold mb-4">Stay Updated</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get exclusive market insights, new listings, and special offers delivered to your inbox.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="sm"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
              </div>

              {/* Legal Links */}
              <nav aria-label="Legal links">
                <h3 className="text-sm font-semibold mb-4">Legal</h3>
                <ul className="space-y-3">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} Watch Pros. All rights reserved.
              </p>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
