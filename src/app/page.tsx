import { ExamSelection } from "@/components/exam/ExamSelection";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Hero } from "@/components/layout/Hero";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/30">
        <Hero />
        <ExamSelection />
      </main>
      <AppFooter />
    </div>
  );
}
