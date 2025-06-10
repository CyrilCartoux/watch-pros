"use client"

import Head from "next/head"                         // Pour les métadonnées SEO
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = {
  main: [
    { name: "About", href: "/about" },
    { name: "Brands", href: "/brands" },
    { name: "Listings", href: "/listings" },
    { name: "Sellers", href: "/sellers" },
    { name: "FAQ & Contact", href: "/help" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  social: [
    { name: "Facebook", href: "https://facebook.com/WatchPros", icon: Facebook },
    { name: "Instagram", href: "https://instagram.com/WatchPros", icon: Instagram },
    { name: "Twitter", href: "https://twitter.com/WatchPros", icon: Twitter },
    { name: "LinkedIn", href: "https://linkedin.com/company/WatchPros", icon: Linkedin },
  ],
}

export function Footer() {
  return (
    <>
      <Head>
        {/* Les métadonnées peuvent être centralisées dans votre layout global */}
      </Head>

      <footer role="contentinfo" className="bg-muted/50">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Branding & Social */}
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="text-2xl font-bold">
                Watch Pros
              </Link>
              <p className="text-muted-foreground max-w-md">
                The premier B2B marketplace for luxury watches. Connect with trusted dealers and collectors worldwide.
              </p>
              <nav aria-label="Suivez-nous">
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

            {/* Navigation Principale */}
            <nav aria-label="Navigation principale">
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

            {/* Liens Légaux */}
            <nav aria-label="Liens légaux">
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

            {/* Newsletter & Preuve sociale */}
            <div>
              <h3 className="text-sm font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Recevez nos exclusivités et insights marché.
              </p>
              <form className="flex gap-2">
                <label htmlFor="footer-email" className="sr-only">Votre adresse email</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder="email@exemple.com"
                  className="flex-1 rounded border px-3 py-2 text-sm"
                />
                <Button
                  type="submit"
                  size="sm"
                  title="S’abonner à la newsletter Watch Pros"
                  aria-label="S’abonner à la newsletter Watch Pros"
                >
                  Je m’abonne
                </Button>
              </form>
              <p className="italic text-sm text-muted-foreground mt-4">
                Déjà plus de <strong>500</strong> pros inscrits.
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
