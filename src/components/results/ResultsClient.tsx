

"use client";

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateAdaptiveFeedback } from '@/ai/flows/adaptive-feedback';
import { assessReadiness } from '@/ai/flows/readiness-assessment';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BrainCircuit, Home, UserCheck, ListChecks, Check, X, Target, Clock, Trophy, ArrowRight, MessageCircleQuestion } from 'lucide-react';
import { ScoreChart } from './ScoreChart';
import { useAuth } from '@/hooks/use-auth';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

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
  
  
  const getAIInsightsAndSave = useCallback(async () => {
    if (loading || !user || !answers || !questions || isProgressSaved) {
      if (!loading && questions) setLoadingAI(false); // Stop loading if not logged in but questions are loaded
      return;
    }
    
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
  }, [user, loading, isProgressSaved, answers, questions, score, incorrectTopics, updateUserProgress]);
  
  useEffect(() => {
    if (isMounted && questions && !loading) {
      getAIInsightsAndSave();
    }
  }, [isMounted, questions, loading, getAIInsightsAndSave]);


  if (!isMounted || !questions || !answers) {
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
    <div className="bg-background p-4 md:p-8">
      <motion.div 
        className="max-w-7xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center" variants={itemVariants}>
          <h1 className="text-4xl font-bold font-headline text-primary">Well Done! Here Are Your Results.</h1>
          <p className="text-muted-foreground mt-2 text-lg">{user ? 'Your progress has been saved.' : 'Log in to save your progress.'}</p>
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
                    <div className="prose prose-sm dark:prose-invert max-w-none text-foreground prose-headings:text-primary">
                        <ReactMarkdown>{feedback || 'Log in to receive personalized AI feedback based on your performance history.'}</ReactMarkdown>
                    </div>
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
                     <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                        <ReactMarkdown>{readiness || 'Log in to receive a personalized readiness assessment.'}</ReactMarkdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
        </div>

        <motion.div variants={itemVariants}>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-center">What's Next?</CardTitle>
                    <CardDescription className="text-center">Choose your next action to continue your learning journey.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-primary/10 border-primary/20 hover:shadow-lg transition-shadow">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                <ListChecks className="h-10 w-10 text-primary" />
                                <h3 className="text-xl font-bold font-headline text-primary">Review Your Answers</h3>
                                <p className="text-sm text-muted-foreground flex-grow">Deep-dive into each question to understand your mistakes and reinforce your knowledge.</p>
                                <Button size="lg" className="w-full" onClick={() => router.push('/exam/review')}>
                                    Review Answers <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-accent/10 border-accent/20 hover:shadow-lg transition-shadow">
                             <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                <MessageCircleQuestion className="h-10 w-10 text-accent" />
                                <h3 className="text-xl font-bold font-headline text-accent">Ask AI Tutor</h3>
                                <p className="text-sm text-muted-foreground flex-grow">Stuck on a concept from the test? Get an instant, detailed explanation from our AI.</p>
                                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => router.push('/chat')}>
                                    Chat with AI <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="text-center pt-2">
                         <Button variant="ghost" onClick={() => router.push('/profile')}>
                            <Home className="mr-2 h-4 w-4" /> Return to Dashboard
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
