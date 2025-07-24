
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Lightbulb, Home, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

const LoadingSkeleton = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
                <Skeleton className="h-full w-full rounded-lg" />
            </div>
            <div className="md:col-span-3">
                 <Skeleton className="h-full w-full rounded-lg" />
            </div>
        </div>
    </div>
);

export default function AnswerReviewClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerSheet | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [loadingExplanation, setLoadingExplanation] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedAnswers = localStorage.getItem('ecetExamAnswers');
    const storedQuestions = localStorage.getItem('ecetExamQuestions');
    if (storedAnswers && storedQuestions) {
      setAnswers(JSON.parse(storedAnswers));
      setQuestions(JSON.parse(storedQuestions));
    } else {
      toast({
        variant: 'destructive',
        title: 'No Exam Data Found',
        description: 'Redirecting to home page.',
      });
      router.replace('/');
    }
  }, [router, toast]);

  if (!isMounted || !questions || !answers) {
    return <LoadingSkeleton />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answers[currentQuestion.id];
  const isCorrect = userAnswer === currentQuestion.correctAnswer;
  
  const getQuestionStatus = (questionId: number) => {
    if (!answers) return 'unanswered';
    const answer = answers[questionId];
    if (answer === undefined) return 'unanswered';
    const question = questions.find(q => q.id === questionId);
    return answer === question?.correctAnswer ? 'correct' : 'incorrect';
  };

  const handleGenerateExplanation = async (questionId: number) => {
    setLoadingExplanation(questionId);
    // TODO: Wire up to a real Genkit flow
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setAiExplanations(prev => ({
      ...prev,
      [questionId]: `This is a placeholder AI explanation for question ${questionId}. The AI would explain that the correct answer is '${currentQuestion.correctAnswer}' because of [concept]. It would also clarify why your answer, '${userAnswer}', was incorrect based on common misconceptions.`
    }));
    setLoadingExplanation(null);
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col md:flex-row bg-secondary/10 text-foreground">
      <aside className="w-full md:w-80 lg:w-96 bg-card border-r p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-headline text-primary">Answer Review</h2>
             <Button variant="outline" size="sm" onClick={() => router.push('/')}><Home className="mr-2 h-4 w-4" /> Home</Button>
        </div>
        <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Correct</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>Incorrect</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-muted border"></div><span>Unanswered</span></div>
        </div>
        <Card className="flex-1 flex flex-col bg-background/50 dark:bg-background/20">
            <CardHeader className="p-4 border-b">
                <CardTitle className="text-base font-headline">Question Palette</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-5 gap-2 p-2">
                  {questions.map((q, index) => {
                    const status = getQuestionStatus(q.id);
                    return (
                      <Button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        variant="outline"
                        className={cn("h-10 w-10 p-0 text-base rounded-lg font-bold",
                          currentQuestionIndex === index && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                          {
                            'bg-green-500/80 text-white border-green-600 hover:bg-green-500': status === 'correct',
                            'bg-red-500/80 text-white border-red-600 hover:bg-red-500': status === 'incorrect',
                            'bg-muted/50 border-muted-foreground/20': status === 'unanswered',
                          }
                        )}
                      >
                        {index + 1}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
        </Card>
      </aside>

      <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <Card className="flex-1 flex flex-col shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">
              Question {currentQuestionIndex + 1}
            </CardTitle>
             <CardDescription>Topic: {currentQuestion.topic}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <p className="text-lg font-semibold">{currentQuestion.question}</p>
            <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                    const isUserAns = userAnswer === option;
                    const isCorrectAns = currentQuestion.correctAnswer === option;
                    
                    return (
                        <div key={index} className={cn("flex items-center space-x-3 rounded-lg p-3 border-2",
                            isCorrectAns ? "border-green-500 bg-green-500/10" : "border-transparent",
                            isUserAns && !isCorrectAns && "border-red-500 bg-red-500/10"
                        )}>
                            {isUserAns && !isCorrectAns && <XCircle className="h-5 w-5 text-red-500"/>}
                            {isCorrectAns && <CheckCircle className="h-5 w-5 text-green-500"/>}
                            <span className={cn("text-base", isCorrectAns && "font-bold")}>{option}</span>
                        </div>
                    )
                })}
            </div>
            
            {!userAnswer && (
                <div className="p-3 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 rounded-lg flex items-center gap-3">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">You did not attempt this question.</p>
                </div>
            )}

             <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2 text-primary">
                        <Lightbulb /> AI Explanation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {aiExplanations[currentQuestion.id] ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap">
                            {aiExplanations[currentQuestion.id]}
                        </div>
                    ) : (
                         <Button 
                            onClick={() => handleGenerateExplanation(currentQuestion.id)} 
                            disabled={loadingExplanation === currentQuestion.id}
                        >
                            {loadingExplanation === currentQuestion.id && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {loadingExplanation === currentQuestion.id ? "Analyzing..." : "Generate Explanation"}
                        </Button>
                    )}
                </CardContent>
             </Card>

          </CardContent>
          <CardFooter className="flex justify-end items-center gap-4 border-t pt-4">
            <Button onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} disabled={currentQuestionIndex === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentQuestionIndex === questions.length - 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
