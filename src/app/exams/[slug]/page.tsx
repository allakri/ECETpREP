import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { ExamDetails } from "@/components/exam/ExamDetails";
import { exams } from "@/components/exam/ExamSelection";

interface ExamDetailsPageProps {
  params: {
    slug: string;
  };
}

export default function ExamDetailsPage({ params }: ExamDetailsPageProps) {
  const { slug } = params;
  const exam = exams.find(e => e.slug === slug);

  if (!exam) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow flex items-center justify-center bg-secondary/30 py-12">
          <h1 className="text-2xl font-bold text-destructive">Exam not found!</h1>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/30 py-12">
        <ExamDetails examName={exam.name} />
      </main>
      <AppFooter />
    </div>
  );
}

// Generate static paths for each exam slug
export async function generateStaticParams() {
  return exams.map((exam) => ({
    slug: exam.slug,
  }));
}
