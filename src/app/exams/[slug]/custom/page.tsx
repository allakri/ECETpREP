
import { exams } from "@/lib/exams";
import { notFound } from "next/navigation";
import { CustomTestClient } from "@/components/exam/CustomTestClient";
import { AppShell } from "@/components/layout/AppShell";
import { Sparkles } from "lucide-react";

interface CustomTestPageProps {
  params: {
    slug: string;
  };
}

// This is a Server Component
export default function CustomTestPage({ params }: CustomTestPageProps) {
  const { slug } = params;
  const exam = exams.find(e => e.slug === slug);

  if (!exam) {
    notFound();
  }

  // The Icon is a component, so we can't pass it as a prop to a client component.
  // We extract it here and pass it as `children`.
  // The rest of the `exam` object is serializable.
  const { icon: Icon, ...serializableExamData } = exam;

  return (
    <AppShell>
      <div className="bg-secondary/30 py-12 md:py-20">
        <CustomTestClient exam={serializableExamData}>
          {/* The icon is passed as a child, which is a valid Server->Client pattern */}
          <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
              <Icon className="h-10 w-10" />
          </div>
        </CustomTestClient>
      </div>
    </AppShell>
  );
}
