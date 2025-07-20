'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { clearDoubt } from '@/ai/flows/doubt-clearing-flow';
import type { MessageData } from 'genkit/experimental/ai';
import type { AnswerSheet, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Home, Send, Bot, User, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppHeader } from '../layout/AppHeader';
import { AppFooter } from '../layout/AppFooter';

type ChatMessage = {
  role: 'user' | 'model';
  text: string;
};

export default function ChatClient() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [examContext, setExamContext] = useState<{ questions: Question[], answers: AnswerSheet } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load exam results from local storage to provide context to the chat
    const storedAnswers = localStorage.getItem('ecetExamAnswers');
    const storedQuestions = localStorage.getItem('ecetExamQuestions');
    if (storedAnswers && storedQuestions) {
      setExamContext({
        answers: JSON.parse(storedAnswers),
        questions: JSON.parse(storedQuestions),
      });
    }
  }, []);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for the AI flow
      const history: MessageData[] = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));
      
      const result = await clearDoubt({
        question: input,
        history: history,
        examQuestions: examContext?.questions,
        examAnswers: examContext?.answers,
      });

      const aiMessage: ChatMessage = { role: 'model', text: result.answer };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting response from AI:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        text: "I'm sorry, but I'm having trouble connecting right now. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);
  
  const getWelcomeMessage = () => {
    const baseMessage = "Have a question? Ask me anything about ECET subjects! For example: \"Explain the difference between series and parallel circuits.\"";
    if (examContext) {
      return "I see you've just finished an exam. You can ask me which questions you got wrong or right, and I can help explain the concepts. Or, ask me anything else about ECET subjects!";
    }
    return baseMessage;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="font-headline text-2xl text-primary">AI Doubt Solver</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground pt-10 px-4">
                    <p>{getWelcomeMessage()}</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'model' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-lg p-3 text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <div className="prose prose-sm dark:prose-invert max-w-none text-inherit whitespace-pre-wrap">{message.text}</div>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent text-accent-foreground"><User size={20}/></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={20}/></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-3">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about your exam or any other doubt..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </form>
          </CardFooter>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
