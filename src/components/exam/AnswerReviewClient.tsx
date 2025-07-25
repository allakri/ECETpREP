

"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { AnswerSheet, Question } from '@/lib/types';
import type { MessageData } from 'genkit/experimental/ai';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Lightbulb, Home, AlertCircle, Loader2, MessageSquarePlus, Bot, User, Send, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { explainAnswer } from '@/ai/flows/explain-answer-flow';
import { clearDoubt } from '@/ai/flows/doubt-clearing-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

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

type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};


export default function AnswerReviewClient() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerSheet | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [aiExplanations, setAiExplanations] = useState<Record<number, string>>({});
  const [loadingExplanation, setLoadingExplanation] = useState<number | null>(null);

  // State for chat within the dialog
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatScrollAreaRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (chatScrollAreaRef.current) {
        chatScrollAreaRef.current.scrollTo({
            top: chatScrollAreaRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }
  }, [chatMessages]);

  const handleGenerateExplanation = useCallback(async (question: Question) => {
    if (aiExplanations[question.id] && loadingExplanation !== question.id) return;
    
    setLoadingExplanation(question.id);
    try {
      const result = await explainAnswer({
        question: question.question,
        options: question.options,
        userAnswer: answers?.[question.id] || "Not Answered",
        correctAnswer: question.correctAnswer,
        topic: question.topic,
      });
      setAiExplanations(prev => ({
        ...prev,
        [question.id]: result.explanation,
      }));
    } catch (error) {
      console.error("Error generating AI explanation:", error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not generate an explanation at this time.',
      });
      setAiExplanations(prev => ({
        ...prev,
        [question.id]: "Sorry, an error occurred while generating the explanation.",
      }));
    } finally {
      setLoadingExplanation(null);
    }
  }, [toast, aiExplanations, answers, loadingExplanation]);

  const handleOpenChatDialog = (question: Question, explanation: string) => {
    setChatMessages([{ role: 'model', text: `Here is the initial explanation for the question:\n\n${explanation}\n\nWhat would you like to discuss further?` }]);
    setChatInput('');
    setIsChatOpen(true);
  };
  
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !questions) return;

    const userMessage: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
        const history: MessageData[] = chatMessages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }],
        }));
        
        const currentQuestion = questions[currentQuestionIndex];
        const contextQuestion = `The user is asking about the following question:\n\nQuestion: "${currentQuestion.question}"\nThe correct answer is "${currentQuestion.correctAnswer}".\nMy initial explanation was: "${aiExplanations[currentQuestion.id]}"\n\nNow, the user's follow-up question is:`;

        const result = await clearDoubt({
            question: `${contextQuestion} ${chatInput}`,
            history: history,
        });

        const aiMessage: ChatMessage = { role: 'model', text: result.answer };
        setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
        console.error('Error getting response from AI:', error);
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
        setChatMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsChatLoading(false);
    }
  };


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
        <Card className="flex-1 flex flex-col bg-background/50 dark:bg-background/20 overflow-hidden">
            <CardHeader className="p-4 border-b">
                <CardTitle className="text-base font-headline">Question Palette</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-2 overflow-y-auto">
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
            <p className="text-lg font-semibold"><Latex>{currentQuestion.question}</Latex></p>
            <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                    const isUserAns = userAnswer === option;
                    const isCorrectAns = currentQuestion.correctAnswer === option;
                    
                    return (
                        <div key={index} className={cn("flex items-center space-x-3 rounded-lg p-3 border-2",
                            isCorrectAns ? "border-green-500 bg-green-500/10" : "border-transparent",
                            isUserAns && !isCorrectAns && "border-red-500 bg-red-500/10"
                        )}>
                            {isCorrectAns && <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0"/>}
                            {isUserAns && !isCorrectAns && <XCircle className="h-5 w-5 text-red-500 flex-shrink-0"/>}
                            {!isCorrectAns && !isUserAns && (userAnswer !== undefined) && <div className="w-5 h-5 flex-shrink-0" /> /* Placeholder for alignment */}
                             {userAnswer === undefined && <div className="w-5 h-5 flex-shrink-0" />}
                            <span className={cn("text-base", isCorrectAns && "font-bold")}><Latex>{option}</Latex></span>
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
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-lg flex items-center gap-2 text-primary">
                            <Lightbulb /> AI Explanation
                        </CardTitle>
                        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="secondary"
                                    size="sm"
                                    disabled={!aiExplanations[currentQuestion.id]}
                                    onClick={() => handleOpenChatDialog(currentQuestion, aiExplanations[currentQuestion.id])}
                                >
                                    <MessageSquarePlus className="mr-2 h-4 w-4" /> Discuss with AI
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px] h-[80vh] flex flex-col">
                                <DialogHeader>
                                    <DialogTitle>Discuss with AI Tutor</DialogTitle>
                                    <DialogDescription>
                                        Ask follow-up questions about "{currentQuestion.question}"
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 overflow-hidden py-4">
                                    <ScrollArea className="h-full pr-4" ref={chatScrollAreaRef}>
                                        <div className="space-y-4">
                                        {chatMessages.map((message, index) => (
                                            <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                                {message.role === 'model' && <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback></Avatar>}
                                                <div className={cn('max-w-[85%] rounded-lg p-3 text-sm', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                                    <div className="prose prose-sm dark:prose-invert max-w-none text-inherit whitespace-pre-wrap"><Latex>{message.text}</Latex></div>
                                                </div>
                                                {message.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback className="bg-accent text-accent-foreground"><User size={20}/></AvatarFallback></Avatar>}
                                            </div>
                                        ))}
                                        {isChatLoading && (
                                            <div className="flex items-start gap-3 justify-start">
                                                <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback></Avatar>
                                                <div className="bg-muted rounded-lg p-3"><Loader2 className="h-5 w-5 animate-spin" /></div>
                                            </div>
                                        )}
                                        </div>
                                    </ScrollArea>
                                </div>
                                <DialogFooter>
                                    <form onSubmit={handleSendChatMessage} className="flex w-full items-center gap-2">
                                        <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask a follow-up question..." disabled={isChatLoading} />
                                        <Button type="submit" disabled={isChatLoading || !chatInput.trim()}><Send className="h-4 w-4" /></Button>
                                    </form>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-32">
                        {aiExplanations[currentQuestion.id] ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap pr-4">
                            <Latex>{aiExplanations[currentQuestion.id]}</Latex>
                        </div>
                    ) : (
                            <Button 
                            onClick={() => handleGenerateExplanation(currentQuestion)} 
                            disabled={loadingExplanation === currentQuestion.id}
                        >
                            {loadingExplanation === currentQuestion.id && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {loadingExplanation === currentQuestion.id ? "Analyzing..." : "Get AI Explanation"}
                        </Button>
                    )}
                    </ScrollArea>
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
