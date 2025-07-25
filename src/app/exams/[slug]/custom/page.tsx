
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { CustomTestSelection } from "@/components/exam/CustomTestSelection";
import { exams } from "@/lib/exams";
import type { Exam } from "@/lib/exams";
import { notFound } from "next/navigation";

interface CustomTestPageProps {
  params: {
    slug: string;
  };
}

export default function CustomTestPage({ params }: CustomTestPageProps) {
  const { slug } = params;
  const exam = exams.find(e => e.slug === slug);

  if (!exam) {
    return notFound();
  }
  
  // Create a new object with only the properties needed by the client component.
  // This avoids passing the non-serializable 'icon' component function.
  const examForClient: Pick<Exam, 'name' | 'subjects'> = {
    name: exam.name,
    subjects: exam.subjects,
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/30 py-12">
        <CustomTestSelection exam={examForClient} />
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
