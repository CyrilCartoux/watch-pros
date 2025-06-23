"use client"

import Head from "next/head"                         // For SEO metadata
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "./ui/use-toast"

const navigation = {
  main: [
    { name: "About", href: "/about" },
    { name: "Listings", href: "/listings" },
    { name: "Sellers", href: "/sellers" },
    { name: "FAQ & Contact", href: "/help" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/terms/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Sales Terms", href: "/terms/sales" },
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
      <footer role="contentinfo" className="bg-muted/50">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Branding & Social */}
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="text-2xl font-bold">
                Watch Pros
              </Link>
              <p className="text-muted-foreground max-w-md">
                The B2B marketplace for luxury watches. Connect with trusted dealers and collectors worldwide.
              </p>
              <nav aria-label="Follow us">
                <div className="flex space-x-4 mt-4">
                  {navigation.social.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="hover:text-foreground"
                      rel="noopener noreferrer"
                      target="_blank"
                      aria-label={item.name}
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </nav>
            </div>

            {/* Main Navigation */}
            <nav aria-label="Main navigation">
              <h3 className="text-sm font-semibold mb-4">Navigation</h3>
              <ul className="space-y-3">
                {navigation.main.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="hover:text-foreground text-muted-foreground">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Legal Links */}
            <nav aria-label="Legal links">
              <h3 className="text-sm font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="hover:text-foreground text-muted-foreground">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Newsletter & Social Proof */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Receive our exclusive offers and market insights.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <label htmlFor="footer-email" className="sr-only">Your email address</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 rounded border px-3 py-2 text-sm"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  title="Subscribe to Watch Pros newsletter"
                  aria-label="Subscribe to Watch Pros newsletter"
                >
                  {isLoading ? "Sending..." : "Subscribe"}
                </Button>
              </form>
              <p className="italic text-sm text-muted-foreground mt-4">
                Already over <strong>500</strong> pros subscribed.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <p className="text-center text-muted-foreground">
              © {new Date().getFullYear()} Watch Pros. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
