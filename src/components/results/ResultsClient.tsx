

"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateAdaptiveFeedback } from '@/ai/flows/adaptive-feedback';
import { assessReadiness } from '@/ai/flows/readiness-assessment';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, Home, Lightbulb, UserCheck, BarChart, MessageCircleQuestion, ListChecks, Check, X, Target, Clock, Trophy } from 'lucide-react';
import { ScoreChart } from './ScoreChart';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const quotes = [
  "Believe you can and you're halfway there.",
  "The secret to getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The expert in anything was once a beginner.",
  "Success is the sum of small efforts, repeated day in and day out."
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ResultsClient() {
  const router = useRouter();
  const { user, loading, updateUserProgress } = useAuth();
  const [answers, setAnswers] = useState<AnswerSheet | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [readiness, setReadiness] = useState<string | null>(null);
  const [loadingAI, setLoadingAI] = useState(true);
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

  const { score, correctCount, incorrectCount, unansweredCount, incorrectTopics, totalQuestions, accuracy } = useMemo(() => {
    if (!answers || !questions) {
      return { score: 0, correctCount: 0, incorrectCount: 0, unansweredCount: 0, incorrectTopics: [], totalQuestions: 0, accuracy: 0 };
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
      accuracy: answeredCount > 0 ? (correct / answeredCount) * 100 : 0,
    };
  }, [answers, questions]);
  
  
  useEffect(() => {
    if (loading || !user || !answers || !questions || isProgressSaved) {
      if (!loading) setLoadingAI(false); // Stop loading if not logged in
      return;
    }

    const getAIInsightsAndSave = async () => {
      setLoadingAI(true);
      try {
        // Save progress first
        const newScoreData = {
            examName: `Test #${(user.tests_taken || 0) + 1}`,
            score: score,
            date: format(new Date(), 'yyyy-MM-dd'),
        };
        await updateUserProgress(newScoreData);
        setIsProgressSaved(true); // Mark as saved

        // Then, fetch AI insights
        const userAnswers: Record<string, string> = {};
        for (const qId in answers) {
          userAnswers[qId] = answers[qId]
        }
        
        const pastScoresWithCurrent = [...(user.exam_score_history || []).map(h => h.score), score];
        
        const [feedbackResult, readinessResult] = await Promise.all([
          generateAdaptiveFeedback({
            examName: 'ECET Practice Exam',
            questions: questions,
            userAnswers,
            pastScores: pastScoresWithCurrent,
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
        console.error("Error generating AI insights or saving progress:", error);
        setFeedback("We're sorry, but the AI feedback service is currently unavailable. Please try again later.");
        setReadiness("We're sorry, but the AI readiness assessment is currently unavailable. Please check your score and try to improve weak topics.");
      } finally {
        setLoadingAI(false);
      }
    };
    
    getAIInsightsAndSave();

  }, [answers, questions, score, incorrectTopics, user, loading, updateUserProgress, isProgressSaved]);

  if (!isMounted) {
    // This state is now handled by the Suspense fallback
    return null;
  }
  
  if (!answers || !questions) {
    // This case should be handled by the redirect, but as a safeguard:
    return null;
  }
  
  const kpiData = [
    { title: "Final Score", value: `${score.toFixed(1)}%`, icon: Trophy, color: "text-amber-500" },
    { title: "Correct Answers", value: `${correctCount}/${totalQuestions}`, icon: Check, color: "text-green-500" },
    { title: "Incorrect Answers", value: `${incorrectCount}/${totalQuestions}`, icon: X, color: "text-red-500" },
    { title: "Accuracy", value: `${accuracy.toFixed(1)}%`, icon: Target, color: "text-blue-500" },
    { title: "Time Taken", value: "N/A", icon: Clock, color: "text-indigo-500" },
  ];


  return (
    <main className="min-h-screen bg-secondary/20 p-4 md:p-8">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className="text-4xl font-bold font-headline text-primary">Well Done! Here Are Your Results.</h1>
          <p className="text-muted-foreground mt-2 text-lg">Congratulations on completing the exam. {user ? 'Your progress has been saved.' : 'Log in to save your progress.'}</p>
           <p className="text-muted-foreground mt-4 italic">"{quote}"</p>
        </motion.div>
        
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" variants={containerVariants}>
            {kpiData.map(item => {
                const Icon = item.icon;
                return (
                    <motion.div key={item.title} variants={itemVariants}>
                        <Card className="shadow-lg h-full">
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <Icon className={`h-8 w-8 mb-2 ${item.color}`} />
                                <p className="text-2xl font-bold">{item.value}</p>
                                <p className="text-sm text-muted-foreground">{item.title}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.div className="lg:col-span-1 h-full" variants={itemVariants}>
              <ScoreChart 
                score={score}
                correctCount={correctCount}
                incorrectCount={incorrectCount}
                unansweredCount={unansweredCount}
                totalQuestions={totalQuestions}
              />
            </motion.div>

            <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
              <Card className="h-full shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BrainCircuit className="h-6 w-6 text-primary"/>
                  </div>
                  <div>
                    <CardTitle className="text-primary font-headline">AI Topic Feedback</CardTitle>
                    <CardDescription>Personalized analysis to guide your next steps.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingAI ? (
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

              <Card className="h-full shadow-lg">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <UserCheck className="h-6 w-6 text-accent"/>
                  </div>
                  <div>
                    <CardTitle className="text-accent font-headline">AI Readiness Guide</CardTitle>
                    <CardDescription>An assessment of your preparedness for the final exam.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingAI ? (
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
            </motion.div>
        </div>

        <motion.div className="text-center flex items-center justify-center gap-4 pt-4" variants={itemVariants}>
            <Button onClick={() => router.push('/')} size="lg" variant="outline" className="font-bold shadow-lg">
                <Home className="mr-2 h-4 w-4"/>
                Back to Home
            </Button>
            <Button onClick={() => router.push('/exam/review')} size="lg" variant="default" className="font-bold shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
                <ListChecks className="mr-2 h-4 w-4"/>
                Review Answers & Learn
            </Button>
            <Button onClick={() => router.push('/chat')} size="lg" variant="secondary" className="font-bold shadow-lg">
                <MessageCircleQuestion className="mr-2 h-4 w-4"/>
                Clear Doubts with AI
            </Button>
        </motion.div>
      </motion.div>
    </main>
  );
}
