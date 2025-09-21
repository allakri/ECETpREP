import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Hero } from "@/components/layout/Hero";
import { Features } from "@/components/layout/Features";
import { HowItWorks } from "@/components/layout/HowItWorks";
import { JoinCommunity } from "@/components/layout/JoinCommunity";

export default function HomePage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-background group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
            <AppHeader />
            <main className="flex-1">
                <Hero />
                <Features />
                <HowItWorks />
                <JoinCommunity />
            </main>
            <AppFooter />
        </div>
    </div>
  );
}
