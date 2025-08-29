
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle, XCircle, HelpCircle, BarChart3, Clock, User, Printer, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SubjectPerformance {
    correct: number;
    total: number;
    accuracy: number;
}

const getGrade = (score: number): { grade: string, color: string } => {
    if (score >= 90) return { grade: 'A', color: 'bg-green-500' };
    if (score >= 80) return { grade: 'B', color: 'bg-blue-500' };
    if (score >= 70) return { grade: 'C', color: 'bg-yellow-500' };
    if (score >= 60) return { grade: 'D', color: 'bg-orange-500' };
    return { grade: 'F', color: 'bg-red-500' };
};

export default function ResultsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, updateUserProgress } = useAuth();
  
  const [examData, setExamData] = useState<{answers: AnswerSheet, questions: Question[], examName: string} | null>(null);
  const [isProgressSaved, setIsProgressSaved] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // New state to manage loading
  const [examCompletionDate] = useState(new Date());

  const sessionKey = useMemo(() => searchParams.get('sessionKey'), [searchParams]);

  const { score, correctCount, incorrectCount, unansweredCount, accuracy, attemptedCount, totalQuestions, subjectPerformance } = useMemo(() => {
    if (!examData) {
      return { score: 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0, accuracy: 0, attemptedCount: 0, totalQuestions: 0, subjectPerformance: {} };
    }
    
    const { answers, questions } = examData;
    const attemptedIds = Object.keys(answers || {});
    const attemptedCount = attemptedIds.length;

    let correctCount = 0;
    questions.forEach(q => {
        if (answers?.[q.id] === q.correctAnswer) {
            correctCount++;
        }
    });

    const totalQuestions = questions.length;
    const incorrectCount = attemptedCount - correctCount;
    const unansweredCount = totalQuestions - attemptedCount;
    
    const subjectPerf: Record<string, { correct: number, total: number }> = {};
    questions.forEach(q => {
        const topic = q.topic || 'General';
        if (!subjectPerf[topic]) {
            subjectPerf[topic] = { correct: 0, total: 0 };
        }
        subjectPerf[topic].total++;

        if (answers?.[q.id] === q.correctAnswer) {
            subjectPerf[topic].correct++;
        }
    });
    
    const subjectPerformanceWithAccuracy: Record<string, SubjectPerformance> = {};
    for(const topic in subjectPerf){
        const { correct: correctAnswers, total: totalAnswers } = subjectPerf[topic];
        subjectPerformanceWithAccuracy[topic] = {
            correct: correctAnswers,
            total: totalAnswers,
            accuracy: totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0
        };
    }

    return {
      score: totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      unansweredCount: unansweredCount,
      accuracy: attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0,
      attemptedCount: attemptedCount,
      totalQuestions: totalQuestions,
      subjectPerformance: subjectPerformanceWithAccuracy,
    };
  }, [examData]);

  const saveProgress = useCallback(async () => {
    if (loading || !user || !examData || isProgressSaved) return;

    try {
      const newScoreData = {
        examName: examData.examName,
        score: score,
        date: format(new Date(), 'yyyy-MM-dd'),
      };
      await updateUserProgress(newScoreData);
      setIsProgressSaved(true);
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, [user, loading, isProgressSaved, examData, score, updateUserProgress]);
  
  useEffect(() => {
    // This effect runs only once to load data
    if (!sessionKey) {
      router.replace('/');
      return;
    }

    const storedData = sessionStorage.getItem(sessionKey);
    if (storedData) {
      try {
        setExamData(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse session data", e);
        router.replace('/');
      }
    }
    setIsDataLoaded(true); // Mark data loading as complete
  }, [sessionKey, router]);
  
  useEffect(() => {
    // This effect runs when data is successfully loaded to save progress
    if (examData && user && !isProgressSaved) {
      saveProgress();
    }
  }, [examData, user, isProgressSaved, saveProgress]);

  // When navigating away from this page, clean up the session storage.
  useEffect(() => {
    return () => {
      if (sessionKey) {
        sessionStorage.removeItem(sessionKey);
      }
    };
  }, [sessionKey]);

  if (!isDataLoaded || loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Calculating Your Results...</p>
        </div>
    );
  }

  if (!examData) {
    // This will only happen if data was genuinely not found after loading.
    // We can show a message or redirect.
    router.replace('/');
    return null; // Return null while redirecting
  }

  const { grade, color: gradeColor } = getGrade(score);

  return (
    <div className="bg-secondary/20 min-h-screen p-4 md:p-8">
        <style jsx global>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
            .results-container {
              padding: 0;
              box-shadow: none;
            }
            .card-print {
              border: 1px solid #e2e8f0;
              box-shadow: none;
            }
            .bg-gradient-to-r {
              background: linear-gradient(to right, #22c55e, #3b82f6) !important;
            }
          }
        `}</style>
        <div className="max-w-6xl mx-auto results-container">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-lg shadow-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Trophy className="h-10 w-10"/>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Exam Results</h1>
                        <p className="opacity-90">{examData.examName}</p>
                    </div>
                </div>
                <div className="text-center">
                    <div className={`w-16 h-16 rounded-full ${gradeColor} flex items-center justify-center text-3xl font-bold`}>
                        {grade}
                    </div>
                    <p className="font-semibold mt-1">Grade</p>
                </div>
            </div>

            {/* User Info */}
            <Card className="rounded-t-none shadow-lg mb-8 card-print">
                <CardContent className="p-6 grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{user?.name || 'Guest User'}</p>
                            <p className="text-muted-foreground">{user?.email || 'No email provided'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Time Taken: 01:45:32</p>
                            <p className="text-muted-foreground">Completed on: {format(examCompletionDate, 'dd/MM/yyyy, HH:mm:ss')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-md card-print">
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <p className="text-3xl font-bold text-green-600">{correctCount}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-muted-foreground">Correct</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="shadow-md card-print">
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-muted-foreground">Wrong</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-md card-print">
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <p className="text-3xl font-bold">{unansweredCount}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-muted-foreground">Unanswered</span>
                        </div>
                    </CardContent>
                </Card>
                 <Card className="shadow-md card-print">
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <p className="text-3xl font-bold text-blue-600">{score.toFixed(1)}%</p>
                        <div className="flex items-center gap-2 mt-1">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-muted-foreground">Score</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Analysis */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <Card className="shadow-lg card-print">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> Performance Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-muted-foreground">Overall Score</span>
                            <span className="font-bold">{score.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-muted-foreground">Accuracy (Attempted)</span>
                            <span className="font-bold">{accuracy.toFixed(1)}%</span>
                        </div>
                        <hr/>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-3xl font-bold">{attemptedCount}</p>
                                <p className="text-muted-foreground">Attempted</p>
                            </div>
                             <div>
                                <p className="text-3xl font-bold">{totalQuestions}</p>
                                <p className="text-muted-foreground">Total</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-lg card-print">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart3/> Subject-wise Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.entries(subjectPerformance).map(([subject, data]) => (
                            <div key={subject}>
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold">{subject}</span>
                                    <span className="text-sm text-muted-foreground">{data.correct}/{data.total}</span>
                                </div>
                                <Progress value={data.accuracy} />
                                <p className="text-xs text-muted-foreground mt-1">{data.accuracy.toFixed(1)}% accuracy</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
            
             {/* AI Tutor CTA */}
            <Card className="shadow-lg mb-8 no-print bg-accent/10 border-accent/20 text-center">
                <CardHeader>
                    <div className="mx-auto bg-accent/20 text-accent p-3 rounded-full w-fit mb-2">
                      <HelpCircle className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-accent text-2xl">Ask AI Tutor</CardTitle>
                    <CardDescription className="max-w-md mx-auto">
                        Stuck on a concept from the test? Get an instant, detailed explanation from our AI.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => {
                        sessionStorage.setItem('ecetExamAnswers', JSON.stringify(examData.answers));
                        sessionStorage.setItem('ecetExamQuestions', JSON.stringify(examData.questions));
                    }}>
                        <Link href="/chat">
                            Chat with AI <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

             {/* Actions */}
             <Card className="shadow-lg no-print">
                <CardContent className="p-6 flex flex-col sm:flex-row justify-center items-center gap-4">
                     <Button size="lg" onClick={() => router.push('/exams')}>Take Another Test</Button>
                     <Button size="lg" variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print Results</Button>
                     <Button size="lg" variant="secondary" onClick={() => {
                        const reviewSessionKey = `review-session-${Date.now()}`;
                        sessionStorage.setItem(reviewSessionKey, JSON.stringify(examData));
                        router.push(`/exam/review?sessionKey=${reviewSessionKey}`);
                    }}>Review Answers</Button>
                </CardContent>
            </Card>

        </div>
    </div>
  );
}
