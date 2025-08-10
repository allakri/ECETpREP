
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
  
  const { icon: Icon, ...serializableCourse } = course;

  return (
    <AppShell>
        <AIMentorClient course={serializableCourse}>
           <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                <Icon className="h-10 w-10" />
            </div>
        </AIMentorClient>
    </AppShell>
  );
}

// Generate static paths for each course slug
export async function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}
