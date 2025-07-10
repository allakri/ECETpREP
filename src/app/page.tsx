import { ExamSelection } from "@/components/exam/ExamSelection";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/30">
        <ExamSelection />
      </main>
      <AppFooter />
    </div>
  );
}
