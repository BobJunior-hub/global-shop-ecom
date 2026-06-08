import { HeroBanner } from "./hero-banner";

export const HeroSection = () => {
  return (
    <section className="w-full px-3 sm:px-4 pt-4">
      <div className="max-w-7xl mx-auto">
        <HeroBanner />
      </div>
    </section>
  );
};
