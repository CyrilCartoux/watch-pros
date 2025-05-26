import { FeaturedBrands } from "@/components/FeaturedBrands"
import { FeaturedListings } from "@/components/FeaturedListings"
import { Footer } from "@/components/Footer"
import { Hero } from "@/components/Hero"
import { HowItWorks } from "@/components/HowItWorks"
import { Navbar } from "@/components/Navbar"
import { Testimonials } from "@/components/Testimonials"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedBrands />
      <FeaturedListings />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  )
}
