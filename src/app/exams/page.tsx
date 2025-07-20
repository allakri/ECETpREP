import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { ExamSelection } from "@/components/exam/ExamSelection";

export default function ExamsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/30 py-12">
        <ExamSelection />
      </main>
      <AppFooter />
    </div>
  );
}
