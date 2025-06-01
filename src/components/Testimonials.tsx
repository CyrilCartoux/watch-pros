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
    quote: "Watch Pros helped me reduce the time spent managing my sales by 70%. The advanced search and alerts are a real plus.",
    author: "Thomas Dubois",
    role: "Jeweler",
    company: "Luxury Timepieces Paris"
  },
  {
    quote: "Finally a serious alternative to Chrono24! The verification badges and professional KYC give us real credibility.",
    author: "Sophie Martin",
    role: "Director",
    company: "Horlogerie & Co"
  },
  {
    quote: "Real-time availability and integrated communication have saved me hours each week. A must for professionals.",
    author: "Marc Laurent",
    role: "Watch Dealer",
    company: "Watch Collector Pro"
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            What Professionals Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover how Watch Pros transforms the daily operations of luxury watch professionals.
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