
import { exams } from "@/lib/exams";
import { notFound } from "next/navigation";
import { CustomTestClient } from "@/components/exam/CustomTestClient";
import { AppShell } from "@/components/layout/AppShell";

interface CustomTestPageProps {
  params: {
    slug: string;
  };
}

// This is now a Server Component
export default function CustomTestPage({ params }: CustomTestPageProps) {
  const { slug } = params;
  const exam = exams.find(e => e.slug === slug);

  if (!exam) {
    notFound();
  }

  // We pass the resolved exam data to the client component
  return (
    <AppShell>
      <div className="bg-secondary/30 py-12 md:py-20">
        <CustomTestClient exam={exam} />
      </div>
    </AppShell>
  );
}
