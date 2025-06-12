import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { SellCTA } from "@/components/SellCTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      {/* <FeaturedListings /> */}
      {/* <FeaturedModels /> */}
      {/* <FeaturedBrands /> */}
      <SellCTA />
    </main>
  );
}
