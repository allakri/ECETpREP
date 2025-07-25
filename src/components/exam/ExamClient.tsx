

"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AnswerSheet, MarkedQuestions, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Timer, BookMarked, ChevronLeft, ChevronRight, Send, LogOut, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

const EXAM_DURATION = 2 * 60 * 60; // 2 hours in seconds
const MAX_VIOLATIONS = 3;

export default function ExamClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerSheet>({});
  const [markedForReview, setMarkedForReview] = useState<MarkedQuestions>([]);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isViolationDialogOpen, setIsViolationDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const violationCount = useRef(0);

  const handleSubmit = useCallback(() => {
    localStorage.setItem('ecetExamAnswers', JSON.stringify(answers));
    if (questions) {
      localStorage.setItem('ecetExamQuestions', JSON.stringify(questions));
    }
    router.replace('/results');
  }, [answers, router, questions]);

  useEffect(() => {
    const examSlug = searchParams.get('examSlug');
    const year = searchParams.get('year');

    async function loadQuestions() {
        if (!examSlug || !year) {
            toast({
                title: 'Error',
                description: 'Exam details not found. Redirecting...',
                variant: 'destructive',
            });
            router.push('/exams');
            return;
        }

        try {
            // Corrected file path construction
            const filePath = `/datasets/${examSlug}_${year}.json`;
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load questions from ${filePath}. Status: ${response.status}`);
            }
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error Loading Questions',
                description: 'Could not load the question paper. Please try again.',
                variant: 'destructive',
            });
             // Fallback to default questions if specific one fails
            const { questions: defaultQuestions } = await import('@/data/questions');
            setQuestions(defaultQuestions);
        }
    }

    loadQuestions();
  }, [searchParams, router, toast]);


  useEffect(() => {
    if (!questions) return; // Don't start timer until questions are loaded

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          toast({ title: "Time's Up!", description: "Your exam has been submitted automatically." });
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            violationCount.current += 1;
            if (violationCount.current >= MAX_VIOLATIONS) {
                toast({ title: "Exam Terminated", description: `Exam submitted due to ${MAX_VIOLATIONS} violations.`, variant: 'destructive' });
                handleSubmit();
            } else {
                setIsViolationDialogOpen(true);
            }
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        clearInterval(timer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleSubmit, questions, toast]);
  
  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleMarkForReview = (questionId: number) => {
    setMarkedForReview(prev =>
      prev.includes(questionId) ? prev.filter(id => id !== questionId) : [...prev, questionId]
    );
  };

  const clearResponse = () => {
    if (!questions) return;
    const questionId = questions[currentQuestionIndex].id;
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
  };
  
  if (!questions) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Loading Question Paper...</p>
        </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isMarked = markedForReview.includes(currentQuestion.id);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getQuestionStatus = (questionId: number) => {
    const isAnswered = answers[questionId] !== undefined;
    const isMarked = markedForReview.includes(questionId);
    if (isAnswered && isMarked) return 'answeredAndMarked';
    if (isAnswered) return 'answered';
    if (isMarked) return 'marked';
    return 'unanswered';
  };

  return (
    <div className="flex h-screen flex-col md:flex-row bg-background text-foreground">
      <main className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-headline text-primary">{searchParams.get('examName') || 'ECET Exam'}</h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-bold p-2 rounded-lg ${timeLeft < 300 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
              <Timer className="h-6 w-6 text-accent" />
              <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsExitDialogOpen(true)}><LogOut className="mr-2 h-4 w-4" /> Exit</Button>
          </div>
        </header>

        <Card className="flex-1 flex flex-col shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-xl">
              Question {currentQuestionIndex + 1}/{questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="mb-6 text-lg"><Latex>{currentQuestion.question}</Latex></p>
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
              className="space-y-4"
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 transition-all duration-200 rounded-lg p-3 hover:bg-primary/5 dark:hover:bg-primary/10">
                  <RadioGroupItem value={option} id={`q${currentQuestion.id}-op${index}`} />
                  <Label htmlFor={`q${currentQuestion.id}-op${index}`} className="text-base cursor-pointer flex-1"><Latex>{option}</Latex></Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between items-center gap-4 border-t pt-6">
            <div className="flex gap-2">
              <Button onClick={() => handleMarkForReview(currentQuestion.id)} variant={isMarked ? "default" : "outline"}>
                <BookMarked className="mr-2 h-4 w-4" /> {isMarked ? 'Unmark Review' : 'Mark for Review'}
              </Button>
              <Button onClick={clearResponse} variant="ghost">Clear Response</Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentQuestionIndex === questions.length - 1}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      <aside className="w-full md:w-80 lg:w-96 bg-card border-l p-4 md:p-6 flex flex-col gap-6">
        <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-2">
                <img src="https://placehold.co/100x100.png" alt="User" data-ai-hint="user avatar" className="rounded-full" />
            </div>
            <h2 className="font-bold font-headline">Student User</h2>
            <p className="text-sm text-muted-foreground">ECET Aspirant</p>
        </div>
        <Card className="flex-1 flex flex-col bg-background/50 dark:bg-background/20 overflow-hidden">
            <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg font-headline">Question Palette</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 overflow-y-auto">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2">
                  {questions.map((q, index) => {
                    const status = getQuestionStatus(q.id);
                    return (
                      <Button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        variant="outline"
                        className={cn("h-10 w-10 p-0 text-base rounded-lg transition-all duration-200",
                          currentQuestionIndex === index && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                          {
                            'bg-green-500/20 text-green-800 dark:text-green-300 border-green-500/50 hover:bg-green-500/30': status === 'answered',
                            'bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/30': status === 'marked',
                            'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-500/50 hover:bg-blue-500/30': status === 'answeredAndMarked',
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
        <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div><span>Answered</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div><span>Marked</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500/20 border-blue-500/50"></div><span>Answered & Marked</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border"></div><span>Not Answered</span></div>
        </div>
        <Button className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" onClick={() => setIsSubmitDialogOpen(true)}>
          <Send className="mr-2 h-4 w-4" /> Submit Exam
        </Button>
      </aside>

      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Confirm Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit the exam? You will not be able to change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <Button onClick={() => {
              setIsSubmitDialogOpen(false);
              toast({ title: "Exam Submitted!", description: "Your answers have been saved." });
              handleSubmit();
            }} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Submit
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isViolationDialogOpen} onOpenChange={setIsViolationDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <AlertDialogTitle className="text-center font-headline text-2xl text-destructive">Warning: Exam Violation</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              You have switched away from the exam window. This is a violation of the rules.
              <br />
              You have <strong className="font-bold">{MAX_VIOLATIONS - violationCount.current}</strong> warning(s) remaining.
              <br />
              If you switch away again, your exam may be terminated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
             <AlertDialogAction onClick={() => setIsViolationDialogOpen(false)} className="w-full">
                I Understand, Continue Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle className="font-headline">Confirm Exit</AlertDialogTitle>
            <AlertDialogDescription>
                Are you sure you want to exit the exam? Your progress will not be saved and you will have to start over.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
                setIsExitDialogOpen(false);
                router.push('/');
            }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, Exit
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
