import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserGuidePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto shadow-lg bg-secondary border-border">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-primary">User Guide</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none text-foreground">
              <h4>1. Selecting an Exam</h4>
              <p>
                From the Home page, you can see a list of available mock tests for various engineering disciplines. Simply click on the test you wish to take to begin.
              </p>
              <h4>2. Taking the Exam</h4>
              <p>
                Once the exam starts, you will be presented with questions one at a time. Select your answer from the given options. You can navigate between questions using the "Next" and "Previous" buttons, or jump to a specific question using the palette on the right. Use the "Mark for Review" button to flag questions you want to revisit.
              </p>
              <h4>3. Submitting and Viewing Results</h4>
              <p>
                After completing the exam, click the "Submit" button. You will be taken to the results page, which provides a detailed analysis of your performance, including your score, a breakdown of correct/incorrect answers, and AI-powered feedback on your weak areas.
              </p>
              <h4>4. Clearing Doubts with AI</h4>
              <p>
                From the results page, you can navigate to our "AI Doubt Solver". Here, you can ask any question related to the exam subjects or even ask about specific questions from the test you just took. The AI tutor is available 24/7 to help you.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
