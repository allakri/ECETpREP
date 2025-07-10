"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { generateAdaptiveFeedback } from '@/ai/flows/adaptive-feedback';
import { assessReadiness } from '@/ai/flows/readiness-assessment';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, Home, Lightbulb, UserCheck, BarChart, MessageCircleQuestion } from 'lucide-react';
import { ScoreChart } from './ScoreChart';

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

  const { score, correctCount, incorrectCount, unansweredCount, incorrectTopics, totalQuestions } = useMemo(() => {
    if (!answers || !questions) {
      return { score: 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0, incorrectTopics: [], totalQuestions: 0 };
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
      incorrectTopics: incorrectTop,
      totalQuestions: total,
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
            <div className="w-full max-w-6xl mx-auto p-4 md:p-8 space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[450px] w-full rounded-lg" />
                    <Skeleton className="h-[450px] w-full rounded-lg" />
                    <Skeleton className="h-[450px] w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Here's your result</h1>
          <p className="text-muted-foreground">Congratulations on completing the exam. Here's a detailed breakdown.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-1 h-full">
              <ScoreChart 
                score={score}
                correctCount={correctCount}
                incorrectCount={incorrectCount}
                unansweredCount={unansweredCount}
                totalQuestions={totalQuestions}
              />
            </div>

            <div className="lg:col-span-1">
              <Card className="h-full shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BrainCircuit className="h-6 w-6 text-primary"/>
                  </div>
                  <CardTitle className="text-primary font-headline">AI Topic Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{feedback}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="h-full shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <UserCheck className="h-6 w-6 text-accent-foreground"/>
                  </div>
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
        </div>

        <Card className="bg-background shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Lightbulb className="h-8 w-8 text-secondary-foreground" />
                <blockquote className="text-secondary-foreground italic">"{quote}"</blockquote>
              </div>
            </CardContent>
        </Card>

        <div className="text-center flex items-center justify-center gap-4">
            <Button onClick={() => router.push('/')} variant="default" className="font-bold shadow-lg">
                <Home className="mr-2 h-4 w-4"/>
                Back to Home
            </Button>
            <Button onClick={() => router.push('/chat')} variant="outline" className="font-bold shadow-lg">
                <MessageCircleQuestion className="mr-2 h-4 w-4"/>
                Clear Doubts with AI
            </Button>
        </div>
      </div>
    </main>
  );
}
