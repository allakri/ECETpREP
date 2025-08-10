
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { courses } from "@/lib/courses";
import { CourseClientPage } from "@/components/course/CourseClientPage";
import { AppShell } from "@/components/layout/AppShell";
import { notFound } from "next/navigation";

interface CourseSubPageProps {
  params: {
    slug: string;
  };
}

export default function CourseSubPage({ params }: CourseSubPageProps) {
  const { slug } = params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return notFound();
  }

  const { icon: Icon, ...serializableCourseData } = course;

  return (
    <AppShell>
        <CourseClientPage course={serializableCourseData}>
          <div className="p-4 bg-primary/10 rounded-lg">
            <Icon className="h-12 w-12 text-primary" />
          </div>
        </CourseClientPage>
    </AppShell>
  );
}

// Generate static paths for each course slug
export async function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}
