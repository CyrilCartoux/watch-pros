"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BadgeCheck, Search, Bell, Shield, Clock, MessageSquare, CreditCard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const features = [
  {
    title: "Advanced Search",
    description: "Filter by brand, model, condition, country and immediate availability. Find exactly what you're looking for in just a few clicks.",
    icon: Search,
  },
  {
    title: "Seller Verification",
    description: "Rating system and trust badges to ensure transaction reliability. Professional KYC for all sellers.",
    icon: Shield,
  },
  {
    title: "Custom Alerts",
    description: "Receive instant notifications when a desired model becomes available. Never miss an opportunity again.",
    icon: Bell,
  },
  {
    title: "Real-time Availability",
    description: "See instantly if a watch is available, without wasting time on unnecessary messages.",
    icon: Clock,
  },
  {
    title: "Simple Pricing",
    description: "Clear monthly subscription with no hidden fees or commissions. Keep 100% of your sales.",
    icon: CreditCard,
  },
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Why choose Watch Pros?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A platform designed by professionals, for professionals. More efficient than WhatsApp, more accessible than Chrono24.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-none bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/pricing">
            <Button size="lg" className="gap-2">
              View Pricing Plans
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}