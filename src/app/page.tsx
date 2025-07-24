
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Hero } from "@/components/layout/Hero";
import { Features } from "@/components/layout/Features";
import { HowItWorks } from "@/components/layout/HowItWorks";
import { Testimonials } from "@/components/layout/Testimonials";
import { Stats } from "@/components/layout/Stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Placeholder component for "Why ECET Matters" section
const WhyEcetMatters = () => (
  <div className="bg-background py-16 sm:py-24">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">
        Why the ECET is Your Golden Ticket
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
        The ECET is more than just an exam; it's a bridge to top-tier engineering colleges and a high-growth career. Success here opens doors to opportunities that can shape your future.
      </p>
      <div className="mt-8">
        <Button size="lg" variant="outline">Learn More About ECET</Button>
      </div>
    </div>
  </div>
);

// Placeholder component for "Success Stories" section
const SuccessStories = () => (
  <div className="bg-card py-16 sm:py-24">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
        From Our Community: Success Stories
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg leading-8 text-muted-foreground">
        Real stories from students who turned their hard work into success with our platform.
      </p>
       <div className="mt-8">
        <Button size="lg">Read Success Stories</Button>
      </div>
    </div>
  </div>
);


export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <WhyEcetMatters />
        <Testimonials />
        <SuccessStories />
      </main>
      <AppFooter />
    </div>
  );
}
