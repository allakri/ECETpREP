
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AnswerSheet, MarkedQuestions, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Timer, BookMarked, ChevronLeft, ChevronRight, Send, LogOut, Loader2, PanelRightOpen, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';

const EXAM_DURATION = 2 * 60 * 60; // 2 hours in seconds

// A simple mapping from full slug to the folder name convention
const slugToFolderMap: Record<string, string> = {
    'computer-science': 'CSE',
    'civil-engineering': 'CIVIL',
    'electronics-communication': 'ECE',
    'electrical-electronics': 'EEE',
    'mechanical-engineering': 'MECH',
    'pharmacy': 'PHARMACY',
    'chemical-engineering': 'CHEM',
    'metallurgical-engineering': 'MET',
    'bsc-mathematics': 'BSCMATHS',
};


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
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [examName, setExamName] = useState('ECET Exam');
  const isSubmitting = useRef(false);
  const [startedAt] = useState(new Date().toISOString());

  const handleSubmit = useCallback(() => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    
    if (questions) {
        // Save the complete data needed for validation to localStorage
        localStorage.setItem("lastExamData", JSON.stringify({
            answers,
            questions,
            examName,
            startedAt,
            submittedAt: new Date().toISOString(),
        }));
    }
    
    // Add a small delay to ensure state updates before navigation
    setTimeout(() => router.replace(`/results`), 100);

  }, [answers, questions, examName, router, startedAt]);


  useEffect(() => {
    async function loadQuestions() {
        // **Cleanup logic**: Remove old exam data before starting a new one.
        localStorage.removeItem("lastExamData");

        const customExamKey = searchParams.get('customExamKey');
        const examSlug = searchParams.get('examSlug');
        const year = searchParams.get('year');
        const offlineTestKey = searchParams.get('offlineTestKey');
        const examBoard = searchParams.get('examBoard');

        if (customExamKey) {
            const customQuestionsStr = sessionStorage.getItem(customExamKey);
            if (customQuestionsStr) {
                setQuestions(JSON.parse(customQuestionsStr));
                setExamName(sessionStorage.getItem('customExamName') || 'AI Custom Test');
                 // Clean up the temporary custom exam data
                sessionStorage.removeItem(customExamKey);
                sessionStorage.removeItem('customExamName');
            } else {
                 toast({ title: 'Error', description: 'Custom exam data not found.', variant: 'destructive' });
                 router.push('/exams');
            }
        } else if (offlineTestKey) {
             const offlineDataRaw = localStorage.getItem(offlineTestKey);
             if (offlineDataRaw) {
                 const offlineData = JSON.parse(offlineDataRaw);
                 setQuestions(offlineData.questions);
                 setExamName(`${offlineData.examName} - ${offlineData.year} (Offline)`);
             } else {
                 toast({ title: 'Error', description: 'Offline exam data not found.', variant: 'destructive' });
                 router.push('/exams/offline');
             }
        } else if (examSlug && year && examBoard) {
            setExamName(searchParams.get('examName') || 'ECET Exam');
            try {
                const examBoardFolder = examBoard.toUpperCase();
                const folderName = slugToFolderMap[examSlug] || examSlug.toUpperCase();
                const filePath = `/datasets/${examBoardFolder}/${folderName}/${year}.json`;
                const response = await fetch(filePath);
                if (!response.ok) throw new Error(`Failed to load questions from ${filePath}. Status: ${response.status}`);
                const data = await response.json();
                setQuestions(data);
            } catch (error) {
                console.error(error);
                toast({ title: 'Error Loading Questions', description: 'Could not load the question paper. It might not be available yet.', variant: 'destructive' });
                router.push('/exams');
            }
        } else {
            toast({ title: 'Error', description: 'Invalid exam parameters. Please select an exam again.', variant: 'destructive' });
            router.push('/exams');
        }
    }

    loadQuestions();
  }, [searchParams, router, toast]);
  
  useEffect(() => {
    if (!questions) return;

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

    return () => {
        clearInterval(timer);
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

  const PaletteContent = () => (
    <div className="flex flex-col h-full bg-card rounded-lg">
        <div className="p-4 border-b">
            <h3 className="font-bold text-lg font-headline">Question Palette</h3>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
            <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-7 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {questions.map((q, index) => {
                    const status = getQuestionStatus(q.id);
                    return (
                    <Button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        variant="outline"
                        size="icon"
                        className={cn("h-10 w-10 p-0 text-base rounded-lg transition-all duration-200 font-bold",
                        currentQuestionIndex === index && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        {
                            'bg-green-500/80 text-white border-green-600 hover:bg-green-500': status === 'answered',
                            'bg-yellow-500/80 text-white border-yellow-600 hover:bg-yellow-500': status === 'marked',
                            'bg-blue-500/80 text-white border-blue-600 hover:bg-blue-500': status === 'answeredAndMarked',
                            'bg-muted/50 border-muted-foreground/20': status === 'unanswered',
                        }
                        )}
                    >
                        {index + 1}
                    </Button>
                    );
                })}
            </div>
        </div>
        <div className="p-4 border-t flex-shrink-0">
            <div className="space-y-2 text-xs w-full mb-4">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Answered</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span>Marked for Review</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span>Answered & Marked</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-muted border"></div><span>Not Answered</span></div>
            </div>
            <Button className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" onClick={() => setIsSubmitDialogOpen(true)}>
                <Send className="mr-2 h-4 w-4" /> Submit Exam
            </Button>
        </div>
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-secondary/20">
        <header className="flex-shrink-0 bg-background border-b shadow-sm">
            <div className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
                <h1 className="text-xl md:text-2xl font-headline text-primary truncate pr-4">{examName}</h1>
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className={cn('flex items-center gap-2 font-bold p-2 rounded-lg text-foreground', timeLeft < 300 && 'text-destructive animate-pulse')}>
                        <Timer className="h-6 w-6 text-accent" />
                        <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
                    </div>
                     <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="md:hidden" size="icon"><PanelRightOpen className="h-5 w-5" /></Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-2 w-[300px] sm:w-[350px] bg-secondary/20 border-l-0">
                            <PaletteContent />
                        </SheetContent>
                    </Sheet>
                    <Button variant="outline" size="icon" onClick={() => setIsExitDialogOpen(true)} className="hidden sm:inline-flex"><LogOut className="h-5 w-5" /></Button>
                </div>
            </div>
        </header>

        <div className="flex-1 container mx-auto px-4 md:px-6 py-6 flex gap-6 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Card className="flex-1 flex flex-col shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline text-xl">
                            Question {currentQuestionIndex + 1}/{questions.length}
                        </CardTitle>
                        <CardDescription>Topic: {currentQuestion.topic}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 py-0">
                        <ScrollArea className="h-full">
                            <div className="pr-6 space-y-6">
                                <p className="text-lg"><Latex>{currentQuestion.question}</Latex></p>
                                <RadioGroup
                                    value={answers[currentQuestion.id] || ''}
                                    onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                                    className="space-y-4"
                                >
                                    {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-start space-x-3 transition-all duration-200 rounded-lg p-3 hover:bg-primary/5 dark:hover:bg-primary/10 border border-transparent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                        <RadioGroupItem value={option} id={`q${currentQuestion.id}-op${index}`} className="mt-1"/>
                                        <Label htmlFor={`q${currentQuestion.id}-op${index}`} className="text-base cursor-pointer flex-1">
                                        <Latex>{option}</Latex>
                                        </Label>
                                    </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 border-t pt-6">
                        <div className="flex gap-2 flex-wrap justify-center">
                            <Button onClick={() => handleMarkForReview(currentQuestion.id)} variant={isMarked ? "default" : "outline"} className={cn(isMarked && "bg-yellow-500 hover:bg-yellow-600 text-white")}>
                                <BookMarked className="mr-2 h-4 w-4" /> {isMarked ? 'Unmark' : 'Mark for Review'}
                            </Button>
                            <Button onClick={clearResponse} variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                <X className="mr-2 h-4 w-4" /> Clear Response
                            </Button>
                        </div>
                        <div className="flex gap-2">
                        <Button onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} disabled={currentQuestionIndex === 0}>
                            <ChevronLeft className="mr-2 h-4 w-4" /> Prev
                        </Button>
                        <Button onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentQuestionIndex === questions.length - 1}>
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* Sidebar */}
            <aside className="w-80 lg:w-96 hidden md:flex flex-col">
                <PaletteContent />
            </aside>
        </div>

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
                isSubmitting.current = true; // Prevent violation trigger on manual exit
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

    