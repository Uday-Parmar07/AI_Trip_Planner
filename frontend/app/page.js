import { SiteNav } from "@/components/layout/site-nav";
import { HeroSection } from "@/components/landing/hero-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <SiteNav />
      <HeroSection />
    </main>
  );
}
