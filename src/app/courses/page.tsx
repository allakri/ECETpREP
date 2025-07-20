import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Civil Engineering",
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Electronics and Instrumentation Engineering",
  "Mechanical Engineering",
  "Metallurgical Engineering",
  "Pharmacy",
];

export default function CoursesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto shadow-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-primary">Courses Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                Our mock tests cover all the core subjects and engineering branches included in the ECET syllabus.
              </p>
              <ul className="space-y-3">
                {subjects.map((subject) => (
                  <li key={subject} className="flex items-center text-lg">
                    <CheckCircle className="h-5 w-5 mr-3 text-accent" />
                    <span className="text-foreground">{subject}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
