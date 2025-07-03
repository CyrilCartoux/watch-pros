"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MessageSquare, Clock, Shield, TrendingUp, Users, Target, Zap, Globe, Award, Search, Bell } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const problems = [
  {
    title: "High costs of existing platforms",
    description: "Subscriptions and commissions from current platforms represent a significant cost for professionals.",
    icon: TrendingUp,
  },
  {
    title: "Disorganization of WhatsApp groups",
    description: "No filters, unstructured information, uncertain availability and considerable time waste.",
    icon: MessageSquare,
  },
  {
    title: "Inefficient communication",
    description: "No search engine, no reliable history or reputation, time-consuming 1:1 exchanges.",
    icon: Users,
  },
]

const solutions = [
  {
    title: "Dedicated B2B platform",
    description: "A professional solution specifically designed for the needs of watch industry professionals.",
    icon: Shield,
  },
  {
    title: "Significant time savings",
    description: "Advanced search, real-time availability and integrated communication to optimize your exchanges.",
    icon: Clock,
  },
  {
    title: "Trusted community",
    description: "Verification system and professional badges to ensure transaction reliability.",
    icon: Users,
  },
]

const stats = [
  {
    value: "70%",
    label: "time saved",
    description: "on sales management",
  },
  {
    value: "24h",
    label: "average delay",
    description: "for listing verification",
  },
  {
    value: "100%",
    label: "of sellers",
    description: "professionally verified",
  },
]

const values = [
  {
    title: "Innovation",
    description: "We constantly rethink our platform to offer the best solutions to watch industry professionals.",
    icon: Zap,
  },
  {
    title: "Trust",
    description: "Security and reliability are at the heart of our approach, with a rigorous verification system.",
    icon: Shield,
  },
  {
    title: "Efficiency",
    description: "Our goal is to save professionals time by automating time-consuming tasks.",
    icon: Target,
  },
  {
    title: "Accessibility",
    description: "We make luxury watch B2B trade accessible to all professionals, regardless of their size.",
    icon: Globe,
  },
]

const features = [
  {
    title: "Advanced search",
    description: "Filter by brand, model, condition, country and immediate availability.",
    icon: Search,
  },
  {
    title: "Custom alerts",
    description: "Receive instant notifications for sought-after models.",
    icon: Bell,
  },
  {
    title: "Integrated communication",
    description: "Exchange directly on the platform or via WhatsApp/Telegram.",
    icon: MessageSquare,
  },
  {
    title: "Professional badges",
    description: "Validate your status and gain buyers' trust.",
    icon: Award,
  },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-12 md:pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 md:mb-6">
                Our Vision
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4 md:px-0">
                Empowering the global luxury watch trade with a secure, efficient, and trusted B2B platform. We believe professionals deserve a modern, commission-free marketplace designed for their unique needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Join Watch Pros®
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/contact" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                    Contact us
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Philosophy Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
                Built for B2B Excellence
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4 md:px-0">
                Watch Pros® is more than a marketplace—it's a new standard for trust, efficiency, and growth in the luxury watch industry. We empower professionals with the tools and environment they need to thrive, without distractions or hidden costs.
              </p>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
              The B2B Challenges We Solve
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Watch Pros® was born from the real pain points of professional dealers, brokers, and industry players.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-muted/50 h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">High Platform Costs</h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Traditional B2B platforms charge high commissions and subscription fees, eating into your margins.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
                <Card className="border-none shadow-none bg-muted/50 h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">WhatsApp Group Chaos</h3>
                      </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Unstructured chats, no search, no filters, and no way to track offers or availability. Time wasted, opportunities lost.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-muted/50 h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Lack of Trust & Transparency</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                    No professional verification, no reputation system, and no secure environment for high-value deals.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Our Solutions & Features */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
              Our Solution: The Modern B2B Marketplace
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Watch Pros® delivers a unified, secure, and efficient platform built for professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-background h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Verified Professional Network</h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Every member is KYC-verified. Only trusted professionals can access the marketplace.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
                <Card className="border-none shadow-none bg-background h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Efficiency & Time Savings</h3>
                      </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Advanced search, real-time availability, and instant alerts. Manage your business, not your inbox.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-background h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Trust & Reputation</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                    Build your reputation with verified badges, reviews, and transparent transaction history.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
              Platform Features
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Everything you need to grow your B2B watch business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-muted/50 h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Search className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Advanced Search & Filters</h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Instantly find the right watches or accessories by brand, model, condition, country, and more.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-muted/50 h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Bell className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Custom Alerts</h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Get notified instantly when a sought-after model is listed or a price changes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
                <Card className="border-none shadow-none bg-muted/50 h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Integrated Messaging</h3>
                      </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Communicate securely with other professionals—on-platform or via your preferred channels.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-muted/50 h-full">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Professional Badges</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                    Showcase your verified status and build trust with every transaction.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 md:mb-4">
              Our Core Values
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              The principles that guide our team and our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-background">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Innovation</h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    We constantly rethink and improve our platform to deliver the best B2B experience.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-background">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Trust & Security</h3>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Security and reliability are at the heart of everything we do, from KYC to data protection.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
                <Card className="border-none shadow-none bg-background">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Efficiency</h3>
                      </div>
                  <p className="text-sm md:text-base text-muted-foreground">
                    We help professionals save time and focus on what matters: growing their business.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}>
              <Card className="border-none shadow-none bg-background">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                    <Globe className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="font-semibold text-base md:text-lg">Global Accessibility</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                    We make luxury watch B2B trade accessible to all professionals, regardless of size or location.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-6">
              Ready to transform your B2B watch business?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-4 md:px-0">
              Join the global network of professionals who are already redefining the industry with Watch Pros®.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Create my account
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}