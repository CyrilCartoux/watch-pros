"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Watch, Gift } from "lucide-react"
import Link from "next/link"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

export default function SellPage() {
  return (
    <ProtectedRoute requireSeller requireVerified>
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-6 md:pb-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
              List for Sale
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4 md:px-0">
              Choose the type of product you want to sell on Watch Pros
            </p>
          </div>
        </div>
      </section>

      {/* Selection Cards */}
      <section className="py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Watch Card */}
            <Link href="/sell/watch" className="block">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Watch className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Watch</h2>
                    <p className="text-muted-foreground mb-6">
                      List your luxury watch for sale. Our platform allows you to reach a wide community of enthusiasts and professionals.
                    </p>
                    <Button size="lg" className="w-full">
                      Sell a watch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Accessory Card */}
            <Link href="/sell/accessory" className="block">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Gift className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Accessory</h2>
                    <p className="text-muted-foreground mb-6">
                      Sell your watch accessories: straps, boxes, tools, etc. An opportunity to reach a targeted customer base.
                    </p>
                    <Button size="lg" variant="outline" className="w-full">
                      Sell an accessory
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why sell on Watch Pros?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4">
                <h3 className="font-semibold mb-2">Targeted Community</h3>
                <p className="text-muted-foreground text-sm">
                  Access a community of watch enthusiasts and professionals.
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Secure Process</h3>
                <p className="text-muted-foreground text-sm">
                  Benefit from a secure payment system and fraud protection.
                </p>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Dedicated Support</h3>
                <p className="text-muted-foreground text-sm">
                  Our team is here to support you throughout the selling process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    </ProtectedRoute>
  )
}