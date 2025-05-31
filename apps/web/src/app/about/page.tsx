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
                Revolutionizing luxury watch B2B trade by offering a professional, efficient and accessible platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 px-4 md:px-0">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Join Watch Pros
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

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 md:p-0"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-base md:text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm md:text-base text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
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
              Market Challenges
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              We have identified the main obstacles faced by watch industry professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-none bg-muted/50 h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <problem.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg">{problem.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
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
              Our Solutions
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Concrete answers to market challenges, designed for professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-none bg-background h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <solution.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg">{solution.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {solution.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
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
              Key Features
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              Powerful tools to optimize your business.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-none bg-muted/50 h-full">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg">{feature.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
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
              Our Values
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4 md:px-0">
              The principles that guide our daily actions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none shadow-none bg-background">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <value.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-base md:text-lg">{value.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              Ready to join the revolution?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 px-4 md:px-0">
              Join the community of professionals who are already transforming the way they do business.
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