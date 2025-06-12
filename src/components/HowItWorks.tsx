"use client"

import Head from "next/head"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Bell, Shield, Clock, CreditCard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Targeted Search",
    description: "Find the perfect watch in seconds: filter by brand, model, condition, and immediate availability.",
    icon: Search,
  },
  {
    title: "Verified Dealers",
    description: "Every seller is verified for trust and security. Professional KYC for every account.",
    icon: Shield,
  },
  {
    title: "Instant Alerts",
    description: "Get notified the moment a watch you want is listed. Never miss an opportunity.",
    icon: Bell,
  },
  {
    title: "Real-Time Availability",
    description: "See which watches are available right now, no endless messaging required.",
    icon: Clock,
  },
  {
    title: "Transparent Pricing",
    description: "Clear monthly subscription, zero commission: keep 100% of your sales.",
    icon: CreditCard,
  },
]

export function HowItWorks() {
  return (
    <>
      <Head>
        <title>How it works – Watch Pros B2B Marketplace</title>
        <meta
          name="description"
          content="Discover Watch Pros: the B2B marketplace for luxury watches. Targeted search, verified dealers, instant alerts, and transparent pricing. Find your next watch now!"
        />
        <link rel="canonical" href="https://yourdomain.com/how-it-works" />
      </Head>

      <section className="py-20 md:py-32 bg-background">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-primary">
              How it works
            </h2>
            <p className="text-base md:text-xl text-muted-foreground max-w-xl mx-auto">
              Watch Pros makes buying and selling watches between professionals simple, fast, and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 mb-12">
            {features.map((feat, i) => (
              <Card key={i} className="bg-background border-none shadow-none">
                <CardContent className="p-0 flex flex-col items-center text-center">
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                    <feat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center text-muted-foreground mb-12">
            <span className="text-sm">Already trusted by <strong>500+</strong> professionals.</span>
          </div>

          <div className="text-center">
            <Link href="/register" passHref>
              <Button
                size="lg"
                className="h-12 px-8 text-base md:text-lg font-semibold shadow-md"
                title="Create Your Pro Account"
                aria-label="Create Your Pro Account"
              >
                Create Your Pro Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
