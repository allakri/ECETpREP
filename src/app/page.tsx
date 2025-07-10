import { ExamSelection } from "@/components/exam/ExamSelection";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Hero } from "@/components/layout/Hero";
import { OurMission } from "@/components/layout/OurMission";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow">
        <Hero />
        <OurMission />
        <ExamSelection />
      </main>
      <AppFooter />
    </div>
  );
}
