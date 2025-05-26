"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const CarouselContext = React.createContext<{
  currentSlide: number
  totalSlides: number
  setCurrentSlide: (slide: number) => void
}>({
  currentSlide: 0,
  totalSlides: 0,
  setCurrentSlide: () => {},
})

export function Carousel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [totalSlides, setTotalSlides] = React.useState(0)

  React.useEffect(() => {
    const slides = document.querySelectorAll("[data-carousel-slide]")
    setTotalSlides(slides.length)
  }, [])

  return (
    <CarouselContext.Provider
      value={{ currentSlide, totalSlides, setCurrentSlide }}
    >
      <div
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { currentSlide } = React.useContext(CarouselContext)
  
  return (
    <div
      className={cn("flex transition-transform duration-500 ease-in-out", className)}
      style={{
        transform: `translateX(-${currentSlide * 100}%)`,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

export function CarouselItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-carousel-slide
      className={cn("min-w-full flex-shrink-0", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function CarouselPrevious({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { currentSlide, setCurrentSlide, totalSlides } = React.useContext(CarouselContext)

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute left-4 top-1/2 -translate-y-1/2",
        className
      )}
      onClick={() => setCurrentSlide((currentSlide - 1 + totalSlides) % totalSlides)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
}

export function CarouselNext({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { currentSlide, setCurrentSlide, totalSlides } = React.useContext(CarouselContext)

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "absolute right-4 top-1/2 -translate-y-1/2",
        className
      )}
      onClick={() => setCurrentSlide((currentSlide + 1) % totalSlides)}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
}

export function CarouselDots({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { currentSlide, setCurrentSlide, totalSlides } = React.useContext(CarouselContext)

  return (
    <div
      className={cn("flex justify-center gap-2 mt-4", className)}
      {...props}
    >
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          className={cn(
            "h-2 w-2 rounded-full transition-colors",
            currentSlide === index ? "bg-primary" : "bg-muted"
          )}
          onClick={() => setCurrentSlide(index)}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  )
} 