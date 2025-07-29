
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateCustomQuiz } from "@/ai/flows/generate-custom-quiz";
import type { Question } from "@/lib/types";
import { z } from "zod";
import type { Exam } from "@/lib/exams";

// Define Zod schemas and types here, in the client component
const GenerateQuizInputSchema = z.object({
  subjects: z.array(z.string()).min(1).describe('An array of one or more subjects to generate questions from.'),
  topics: z.string().optional().describe('Optional comma-separated list of specific topics to focus on within the subjects.'),
  easyQuestions: z.number().int().min(0).describe('Number of easy questions to generate.'),
  mediumQuestions: z.number().int().min(0).describe('Number of medium questions to generate.'),
  hardQuestions: z.number().int().min(0).describe('Number of hard questions to generate.'),
});
type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

interface CustomTestClientProps {
  exam: Omit<Exam, 'icon'>; // The icon is passed as children
  children: React.ReactNode;
}

export function CustomTestClient({ exam, children }: CustomTestClientProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [subjects, setSubjects] = useState("");
  const [topics, setTopics] = useState("");
  const [numEasy, setNumEasy] = useState(5);
  const [numMedium, setNumMedium] = useState(5);
  const [numHard, setNumHard] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalQuestions = numEasy + numMedium + numHard;

  const handleGenerateQuiz = async () => {
    const parsedSubjects = subjects.split(',').map(s => s.trim()).filter(s => s.length > 0);

    if (totalQuestions === 0) {
      toast({
        variant: "destructive",
        title: "No Questions Requested",
        description: "Please select at least one question to generate.",
      });
      return;
    }
     if (parsedSubjects.length === 0) {
      toast({
        variant: "destructive",
        title: "No Subjects Provided",
        description: "Please enter at least one subject.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const quizInput: GenerateQuizInput = {
        subjects: parsedSubjects,
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
      
      const examName = `AI Custom Test (${parsedSubjects.join(", ")})`;
      const sessionKey = `custom-exam-${Date.now()}`;
      
      sessionStorage.setItem(sessionKey, JSON.stringify(generatedQuestions));
      sessionStorage.setItem('customExamName', examName);
      
      const params = new URLSearchParams({
        customExamKey: sessionKey,
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
    <div id="custom-test-selection" className="container mx-auto px-4">
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader className="text-center">
          {children}
          <CardTitle className="text-3xl font-headline text-primary">
            AI Custom Quiz Generator
          </CardTitle>
          <CardDescription>
            Tailor a practice test to your exact needs for {exam.name}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <Label htmlFor="subjects" className="text-lg font-semibold">1. Enter Subjects (Required)</Label>
            <Input
              id="subjects"
              placeholder="e.g., Data Structures, Operating Systems"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">Separate multiple subjects with a comma.</p>
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
            disabled={isLoading || totalQuestions === 0 || subjects.trim() === ""}
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
  );
}
