
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { ExamDetails } from "@/components/exam/ExamDetails";
import { exams } from "@/lib/exams";
import { notFound } from 'next/navigation';

interface ExamDetailsPageProps {
  params: {
    slug: string;
  };
}

export default function ExamDetailsPage({ params }: ExamDetailsPageProps) {
  const exam = exams.find(e => e.slug === params.slug);

  if (!exam) {
    return notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12">
        <ExamDetails examName={exam.name} examSlug={exam.slug} />
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
