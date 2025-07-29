
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { exams } from "@/lib/exams";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCustomQuiz } from "@/ai/flows/generate-custom-quiz";
import type { Question } from "@/lib/types";
import { AppShell } from "@/components/layout/AppShell";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from "zod";

// Define Zod schemas and types here, in the client component
const GenerateQuizInputSchema = z.object({
  subjects: z.array(z.string()).describe('An array of one or more subjects to generate questions from.'),
  topics: z.string().optional().describe('Optional comma-separated list of specific topics to focus on within the subjects.'),
  easyQuestions: z.number().int().min(0).describe('Number of easy questions to generate.'),
  mediumQuestions: z.number().int().min(0).describe('Number of medium questions to generate.'),
  hardQuestions: z.number().int().min(0).describe('Number of hard questions to generate.'),
});
type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;


interface CustomTestPageProps {
  params: {
    slug: string;
  };
}

export default function CustomTestPage({ params }: CustomTestPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { slug } = params;
  const exam = exams.find(e => e.slug === slug);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [topics, setTopics] = useState("");
  const [numEasy, setNumEasy] = useState(5);
  const [numMedium, setNumMedium] = useState(5);
  const [numHard, setNumHard] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  if (!exam) {
    return notFound();
  }
  
  const totalQuestions = numEasy + numMedium + numHard;

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setSelectedSubjects(prev =>
      checked ? [...prev, subject] : prev.filter(s => s !== subject)
    );
  };

  const handleGenerateQuiz = async () => {
    if (totalQuestions === 0) {
      toast({
        variant: "destructive",
        title: "No Questions Requested",
        description: "Please select at least one question to generate.",
      });
      return;
    }
     if (selectedSubjects.length === 0) {
      toast({
        variant: "destructive",
        title: "No Subjects Selected",
        description: "Please select at least one subject.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const quizInput: GenerateQuizInput = {
        subjects: selectedSubjects,
        topics: topics,
        easyQuestions: numEasy,
        mediumQuestions: numMedium,
        hardQuestions: numHard,
      };

      const result = await generateCustomQuiz(quizInput);
      const generatedQuestions: Question[] = result.questions;

      if (generatedQuestions.length === 0) {
        throw new Error("The AI returned no questions. Please try again.");
      }
      
      // Store generated questions and navigate to exam instructions
      const examName = `AI Custom Test (${selectedSubjects.join(", ")})`;
      const offlineTestKey = `offline-test-custom-${Date.now()}`;
      
      localStorage.setItem(offlineTestKey, JSON.stringify(generatedQuestions));
      
       // Add to offline index (optional, but good for consistency)
      const indexKey = 'offline-tests-index';
      const existingIndex = JSON.parse(localStorage.getItem(indexKey) || '[]');
      const newIndexEntry = {
          key: offlineTestKey,
          examName: examName,
          examSlug: 'custom',
          year: 'AI',
          downloadedAt: new Date().toISOString(),
      };
      const updatedIndex = existingIndex.filter((item: any) => item.key !== offlineTestKey);
      updatedIndex.push(newIndexEntry);
      localStorage.setItem(indexKey, JSON.stringify(updatedIndex));

      const params = new URLSearchParams({
        offlineTestKey: offlineTestKey,
      });

      router.push(`/exam/instructions?${params.toString()}`);

    } catch (error: any) {
      console.error("Failed to generate custom quiz:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: error.message || "Could not generate the quiz. Please adjust your settings and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="bg-secondary/30 py-12 md:py-20">
        <div id="custom-test-selection" className="container mx-auto px-4">
          <Card className="shadow-lg max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                <Sparkles className="h-10 w-10" />
              </div>
              <CardTitle className="text-3xl font-headline text-primary">
                AI Custom Quiz Generator
              </CardTitle>
              <CardDescription>
                Tailor a practice test to your exact needs for {exam.name}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-3">
                <Label className="text-lg font-semibold">1. Select Subjects (Required)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-background">
                  {exam.subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                        disabled={isLoading}
                      />
                      <Label htmlFor={subject} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="topics" className="text-lg font-semibold">2. Specify Topics (Optional)</Label>
                <Input
                  id="topics"
                  placeholder="e.g., Logic Gates, Process Management, SQL Joins"
                  value={topics}
                  onChange={(e) => setTopics(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Separate topics with commas for best results.</p>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold">3. Set Difficulty Mix</h3>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="easy-slider">Easy Questions: <span className="font-bold text-primary">{numEasy}</span></Label>
                        <Slider
                            id="easy-slider"
                            min={0}
                            max={20}
                            step={1}
                            value={[numEasy]}
                            onValueChange={(value) => setNumEasy(value[0])}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Label htmlFor="medium-slider">Medium Questions: <span className="font-bold text-primary">{numMedium}</span></Label>
                         <Slider
                            id="medium-slider"
                            min={0}
                            max={20}
                            step={1}
                            value={[numMedium]}
                            onValueChange={(value) => setNumMedium(value[0])}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Label htmlFor="hard-slider">Hard Questions: <span className="font-bold text-primary">{numHard}</span></Label>
                         <Slider
                            id="hard-slider"
                            min={0}
                            max={10}
                            step={1}
                            value={[numHard]}
                            onValueChange={(value) => setNumHard(value[0])}
                            disabled={isLoading}
                        />
                    </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 items-center justify-center p-6 bg-muted/50">
              <p className="text-xl font-bold">Total Questions: <span className="text-accent">{totalQuestions}</span></p>
              <Button
                onClick={handleGenerateQuiz}
                disabled={isLoading || totalQuestions === 0 || selectedSubjects.length === 0}
                size="lg"
                className="font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Quiz & Start
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
