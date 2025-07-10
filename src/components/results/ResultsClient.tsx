"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { generateAdaptiveFeedback } from '@/ai/flows/adaptive-feedback';
import { assessReadiness } from '@/ai/flows/readiness-assessment';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, BrainCircuit, Home, Lightbulb, UserCheck } from 'lucide-react';

const quotes = [
  "Believe you can and you're halfway there.",
  "The secret to getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The expert in anything was once a beginner.",
  "Success is the sum of small efforts, repeated day in and day out."
];

export default function ResultsClient() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerSheet | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    const storedAnswers = localStorage.getItem('ecetExamAnswers');
    const storedQuestions = localStorage.getItem('ecetExamQuestions');
    if (storedAnswers && storedQuestions) {
      setAnswers(JSON.parse(storedAnswers));
      setQuestions(JSON.parse(storedQuestions));
    } else {
      router.replace('/'); // No results to show, redirect
    }
  }, [router]);

  const { score, correctCount, incorrectCount, unansweredCount, incorrectTopics } = useMemo(() => {
    if (!answers || !questions) {
      return { score: 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0, incorrectTopics: [] };
    }
    let correct = 0;
    const incorrectTop: string[] = [];
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      } else if (answers[q.id] !== undefined) {
        if (!incorrectTop.includes(q.topic)) {
          incorrectTop.push(q.topic);
        }
      }
    });
    const answeredCount = Object.keys(answers).length;
    const total = questions.length;
    return {
      score: total > 0 ? (correct / total) * 100 : 0,
      correctCount: correct,
      incorrectCount: answeredCount - correct,
      unansweredCount: total - answeredCount,
      incorrectTopics: incorrectTop
    };
  }, [answers, questions]);
  
  useEffect(() => {
    if (answers && questions) {
      const getAIInsights = async () => {
        setLoading(true);
        try {
          const correctAnswers: Record<string, string> = {};
          const topics: Record<string, string> = {};
          questions.forEach(q => {
            correctAnswers[q.id.toString()] = q.correctAnswer;
            topics[q.id.toString()] = q.topic;
          });

          const userAnswers: Record<string, string> = {};
           for (const qId in answers) {
            userAnswers[qId] = answers[qId]
          }

          const [feedbackResult, readinessResult] = await Promise.all([
            generateAdaptiveFeedback({
              examName: 'ECET Practice Exam',
              userAnswers,
              correctAnswers,
              topics,
            }),
            assessReadiness({
              examName: 'ECET Practice Exam',
              score: score,
              incorrectTopics: incorrectTopics
            })
          ]);
          
          setFeedback(feedbackResult.feedback);
          setReadiness(readinessResult.readiness);

        } catch (error) {
          console.error("Error generating AI insights:", error);
          setFeedback("Could not generate feedback at this time. Please try again later.");
          setReadiness("Could not generate readiness assessment at this time.");
        } finally {
          setLoading(false);
        }
      };
      getAIInsights();
    }
  }, [answers, questions, score, incorrectTopics]);

  if (!isMounted || !answers || !questions) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4 p-4">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
                <div className="max-w-4xl w-full mx-auto space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="text-center">
          <Award className="mx-auto h-16 w-16 text-accent" />
          <CardTitle className="text-4xl font-headline mt-4">Exam Results</CardTitle>
          <CardDescription>Here is a summary of your performance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xl font-medium">Your Score</p>
            <p className="text-6xl font-bold font-headline text-primary">{score.toFixed(2)}%</p>
            <Progress value={score} className="w-full max-w-md mx-auto h-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 font-headline">Correct</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{correctCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 font-headline">Incorrect</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{incorrectCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-gray-500 font-headline">Unanswered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{unansweredCount}</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-primary/5">
              <CardHeader className="flex flex-row items-center gap-4">
                <BrainCircuit className="h-8 w-8 text-primary"/>
                <CardTitle className="text-primary font-headline">AI Topic Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{feedback}</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-accent/10">
              <CardHeader className="flex flex-row items-center gap-4">
                <UserCheck className="h-8 w-8 text-accent-foreground"/>
                <CardTitle className="text-accent-foreground font-headline">AI Readiness Guide</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{readiness}</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-secondary">
             <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Lightbulb className="h-8 w-8 text-secondary-foreground" />
                  <blockquote className="text-secondary-foreground italic">"{quote}"</blockquote>
                </div>
             </CardContent>
          </Card>

        </CardContent>
        <CardFooter className="justify-center">
          <Button onClick={() => router.push('/')} variant="default" className="font-bold">
            <Home className="mr-2 h-4 w-4"/>
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
