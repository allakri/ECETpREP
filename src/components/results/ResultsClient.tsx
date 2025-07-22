
"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateAdaptiveFeedback } from '@/ai/flows/adaptive-feedback';
import { assessReadiness } from '@/ai/flows/readiness-assessment';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, Home, Lightbulb, UserCheck, BarChart, MessageCircleQuestion } from 'lucide-react';
import { ScoreChart } from './ScoreChart';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';

const quotes = [
  "Believe you can and you're halfway there.",
  "The secret to getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The expert in anything was once a beginner.",
  "Success is the sum of small efforts, repeated day in and day out."
];

export default function ResultsClient() {
  const router = useRouter();
  const { user, updateUserProgress } = useAuth();
  const [answers, setAnswers] = useState<AnswerSheet | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState(false);

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
  
  const saveProgress = useCallback(async () => {
    if (user && score > 0 && !isProgressSaved) {
        await updateUserProgress({
            examName: `Test #${(user.tests_taken || 0) + 1}`,
            score: score,
            date: format(new Date(), 'yyyy-MM-dd'),
        });
        setIsProgressSaved(true);
    }
  }, [user, score, isProgressSaved, updateUserProgress]);
  
  
  useEffect(() => {
    if (answers && questions && user && !isProgressSaved) {
      const getAIInsightsAndSave = async () => {
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
          
          const pastScoresWithCurrent = [...(user.exam_score_history || []).map(h => h.score), score];

          const [feedbackResult, readinessResult] = await Promise.all([
            generateAdaptiveFeedback({
              examName: 'ECET Practice Exam',
              userAnswers,
              correctAnswers,
              topics,
              pastScores: pastScoresWithCurrent,
            }),
            assessReadiness({
              examName: 'ECET Practice Exam',
              score: score,
              incorrectTopics: incorrectTopics
            }),
            saveProgress() // Save progress in parallel
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
      getAIInsightsAndSave();
    } else if (!user) {
        setLoading(false); // Not logged in, so don't show loading state
    }
  }, [answers, questions, score, incorrectTopics, user, saveProgress, isProgressSaved]);

  if (!isMounted) {
    // This state is now handled by the Suspense fallback
    return null;
  }
  
  if (!answers || !questions) {
    // This case should be handled by the redirect, but as a safeguard:
    return null;
  }


  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Here's your result</h1>
          <p className="text-muted-foreground">Congratulations on completing the exam. {isProgressSaved ? 'Your progress has been saved.' : 'Log in to save your progress.'}</p>
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
                    <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{feedback || 'Log in to receive personalized AI feedback based on your performance history.'}</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="h-full shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <UserCheck className="h-6 w-6 text-accent"/>
                  </div>
                  <CardTitle className="text-accent font-headline">AI Readiness Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{readiness || 'Log in to receive a personalized readiness assessment.'}</div>
                  )}
                </CardContent>
              </Card>
            </div>
        </div>

        <Card className="bg-card shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Lightbulb className="h-8 w-8 text-foreground" />
                <blockquote className="text-foreground italic">"{quote}"</blockquote>
              </div>
            </CardContent>
        </Card>

        <div className="text-center flex items-center justify-center gap-4">
            <Button onClick={() => router.push('/')} variant="default" className="font-bold shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
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
