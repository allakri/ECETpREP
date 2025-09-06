
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, formatDistanceStrict } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Trophy, CheckCircle, XCircle, HelpCircle, BarChart3, Clock, User, Printer, FileText, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SubjectPerformance {
    correct: number;
    total: number;
    accuracy: number;
}

interface ExamResult {
    answers: AnswerSheet, 
    questions: Question[], 
    examName: string,
    startedAt: string,
    submittedAt: string,
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
  
  const [examData, setExamData] = useState<ExamResult | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { score, correctCount, incorrectCount, unansweredCount, accuracy, attemptedCount, totalQuestions, subjectPerformance, timeTaken } = useMemo(() => {
    if (!examData) {
      return { score: 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0, accuracy: 0, attemptedCount: 0, totalQuestions: 0, subjectPerformance: {}, timeTaken: "0s" };
    }
    
    const { answers, questions, startedAt, submittedAt } = examData;
    
    let correctCount = 0;
    questions.forEach(q => {
        if (answers?.[q.id] === q.correctAnswer) {
            correctCount++;
        }
    });

    const attemptedCount = Object.keys(answers || {}).length;
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

    const timeTakenFormatted = formatDistanceStrict(new Date(submittedAt), new Date(startedAt));

    return {
      score: totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0,
      correctCount: correctCount,
      incorrectCount: incorrectCount,
      unansweredCount: unansweredCount,
      accuracy: attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0,
      attemptedCount: attemptedCount,
      totalQuestions: totalQuestions,
      subjectPerformance: subjectPerformanceWithAccuracy,
      timeTaken: timeTakenFormatted,
    };
  }, [examData]);

  useEffect(() => {
    const storedData = localStorage.getItem("lastExamData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setExamData(parsedData);
      } catch (e) {
        console.error("Failed to parse session data", e);
        router.replace('/');
      }
    } else {
        router.replace('/');
    }
    setIsDataLoaded(true);
  }, [router]);


  if (!isDataLoaded || !examData) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-secondary/20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg">Calculating Your Results...</p>
        </div>
    );
  }

  const { grade, color: gradeColor } = getGrade(score);

  return (
    <div className="bg-secondary/20 min-h-screen p-4 md:p-8 print:bg-white print:p-0">
        <style jsx global>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .no-print {
              display: none !important;
            }
            .print-only {
                display: block !important;
            }
            .results-container {
              padding: 0;
              box-shadow: none;
              margin: 0;
            }
            .card-print {
              border: 1px solid #e2e8f0;
              box-shadow: none;
              break-inside: avoid;
            }
            .print-header {
              background-color: #f1f5f9 !important;
              color: black !important;
              border-bottom: 2px solid #e2e8f0;
            }
          }
        `}</style>
        <div className="max-w-6xl mx-auto results-container">
            {/* Header */}
             <div className="hidden print-only mb-4 p-4 border-b">
                <h1 className="text-2xl font-bold text-center">Exam Result</h1>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-lg shadow-lg flex justify-between items-center print:bg-none print-header">
                <div className="flex items-center gap-4">
                    <Trophy className="h-10 w-10"/>
                    <div>
                        <h1 className="text-3xl font-bold font-headline">Exam Results</h1>
                        <p className="opacity-90">{examData.examName}</p>
                    </div>
                </div>
                <div className="text-center no-print">
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
                            <p className="font-semibold">Guest User</p>
                            <p className="text-muted-foreground">Not logged in</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">Time Taken: {timeTaken}</p>
                            <p className="text-muted-foreground">Completed on: {format(new Date(examData.submittedAt), 'dd/MM/yyyy, HH:mm:ss')}</p>
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
                     <Button size="lg" variant="secondary" onClick={() => router.push(`/exam/review`)}>Review Answers</Button>
                </CardContent>
            </Card>

        </div>
    </div>
  );
}
