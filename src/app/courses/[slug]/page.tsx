
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { courses } from "@/lib/courses";
import { CourseClientPage } from "@/components/course/CourseClientPage";

interface CourseSubPageProps {
  params: {
    slug: string;
  };
}

export default function CourseSubPage({ params }: CourseSubPageProps) {
  const { slug } = params;
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow flex items-center justify-center bg-background py-12">
          <h1 className="text-2xl font-bold text-destructive">Course not found!</h1>
        </main>
        <AppFooter />
      </div>
    );
  }

  return <CourseClientPage course={course} />;
}

// Generate static paths for each course slug
export async function generateStaticParams() {
  return courses.map((course) => ({
    slug: course.slug,
  }));
}
