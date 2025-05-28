import { FeaturedBrands } from "@/components/FeaturedBrands"
import { FeaturedModels } from "@/components/FeaturedModels"
import { Hero } from "@/components/Hero"
import { HowItWorks } from "@/components/HowItWorks"
import { SellCTA } from "@/components/SellCTA"
import { Testimonials } from "@/components/Testimonials"

export default function Home() {
  return (
    <main>
      <Hero />
      {/* <FeaturedListings /> */}
      <FeaturedModels />
      <FeaturedBrands />
      <HowItWorks />
      <Testimonials />
      <SellCTA />
    </main>
  )
}
