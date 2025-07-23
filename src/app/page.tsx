import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Hero } from "@/components/layout/Hero";
import { Features } from "@/components/layout/Features";
import { HowItWorks } from "@/components/layout/HowItWorks";
import { Testimonials } from "@/components/layout/Testimonials";
import { OurMission } from "@/components/layout/OurMission";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <OurMission />
        <Testimonials />
      </main>
      <AppFooter />
    </div>
  );
}
