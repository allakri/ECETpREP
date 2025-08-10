
import { AppShell } from "@/components/layout/AppShell";
import { courses } from "@/lib/courses";
import { notFound } from "next/navigation";
import { AIMentorClient } from "./AIMentorClient";
import type { Course } from "@/lib/courses";

interface AIMentorPageProps {
  params: {
    slug: string;
  };
}

export default function AIMentorPage({ params }: AIMentorPageProps) {
  const { slug } = params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return notFound();
  }
  
  // We can pass the whole course object because the icon component won't be serialized.
  // The client component will receive the serializable parts.
  const serializableCourse: Omit<Course, 'icon'> = { ...course };

  return (
    <AppShell>
        <AIMentorClient course={serializableCourse} />
    </AppShell>
  );
}

// Generate static paths for each course slug
export async function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}
