import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto shadow-lg bg-card border-border">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-primary">About Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none text-foreground">
              <p>
                Welcome to the ECET Prep Platform, your number one source for mastering the Engineering Common Entrance Test (ECET). We're dedicated to giving you the very best of preparation tools, with a focus on quality mock tests, instant feedback, and AI-powered doubt clarification.
              </p>
              <p>
                Founded by a team of experienced educators and technologists, our platform has come a long way from its beginnings. When we first started out, our passion for helping students achieve their engineering dreams drove us to create a comprehensive, accessible, and affordable solution for ECET preparation.
              </p>
              <p>
                We now serve students all over the region and are thrilled to be a part of the fair-chance wing of the education industry. We hope you enjoy our platform as much as we enjoy offering it to you. If you have any questions or comments, please don't hesitate to contact us.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
