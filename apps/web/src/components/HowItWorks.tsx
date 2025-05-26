"use client"

import { CheckCircle2, Shield, Users, Wallet } from "lucide-react"

const steps = [
  {
    icon: CheckCircle2,
    title: "Verified Dealers",
    description: "All our dealers undergo a rigorous verification process to ensure authenticity and reliability."
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Our platform provides secure payment processing and escrow services for peace of mind."
  },
  {
    icon: Users,
    title: "Global Network",
    description: "Connect with trusted dealers and collectors from around the world."
  },
  {
    icon: Wallet,
    title: "Competitive Pricing",
    description: "Access market-driven prices and negotiate directly with verified sellers."
  }
]

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How Watch Pros Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform makes it easy to buy and sell luxury watches in a secure, professional environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center text-center p-6 bg-muted/50 rounded-lg"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  )
} 