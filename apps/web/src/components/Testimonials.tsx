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
    quote: "Watch Pros m'a permis de réduire de 70% le temps passé à gérer mes ventes. La recherche avancée et les alertes sont un vrai plus.",
    author: "Thomas Dubois",
    role: "Bijoutier",
    company: "Luxury Timepieces Paris"
  },
  {
    quote: "Enfin une alternative sérieuse à Chrono24 ! Les badges de vérification et le KYC pro nous donnent une vraie crédibilité.",
    author: "Sophie Martin",
    role: "Directrice",
    company: "Horlogerie & Co"
  },
  {
    quote: "La disponibilité en temps réel et la communication intégrée m'ont fait gagner des heures chaque semaine. Un must pour les professionnels.",
    author: "Marc Laurent",
    role: "Marchand de montres",
    company: "Watch Collector Pro"
  }
]

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
            Ce qu'en disent les professionnels
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Découvrez comment Watch Pros transforme le quotidien des professionnels de l'horlogerie de luxe.
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
                          {testimonial.role} chez {testimonial.company}
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