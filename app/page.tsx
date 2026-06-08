import { HeroSection } from "@/src/features/home/components/hero-section";
import { HomeProductsClient } from "@/src/features/home/components/home-products-client";

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      <HeroSection />
      <HomeProductsClient />
    </div>
  );
}
