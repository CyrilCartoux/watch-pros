"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel"
import { Card, CardContent } from "./ui/card"

const testimonials = [
  {
    quote: "Watch Pros has transformed how we source luxury timepieces. Their platform is intuitive and their service is impeccable.",
    author: "Sarah Chen",
    role: "CEO, Luxury Retail Group",
    company: "Luxury Retail Group"
  },
  {
    quote: "The quality of watches and the professionalism of sellers on Watch Pros is unmatched. It's become our go-to platform.",
    author: "Michael Rodriguez",
    role: "Watch Collector",
    company: "Independent Collector"
  },
  {
    quote: "As a dealer, Watch Pros has helped us reach a global audience of serious buyers. The platform is a game-changer.",
    author: "David Kim",
    role: "Founder",
    company: "Horology House"
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join the growing community of luxury watch professionals who trust Watch Pros for their business needs.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="border-none shadow-none h-full bg-background/50 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col h-full">
                      <blockquote className="text-base md:text-lg italic mb-6 flex-grow">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="mt-auto">
                        <p className="font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-6">
              <CarouselPrevious className="static translate-y-0 hover:bg-background/80" />
              <CarouselDots className="mx-2" />
              <CarouselNext className="static translate-y-0 hover:bg-background/80" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
} 