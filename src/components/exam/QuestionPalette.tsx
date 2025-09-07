
"use client";

import React from 'react';
import type { AnswerSheet, MarkedQuestions, Question } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionPaletteProps {
    questions: Question[];
    answers: AnswerSheet;
    markedForReview: MarkedQuestions;
    currentQuestionIndex: number;
    setCurrentQuestionIndex: (index: number) => void;
    setIsSubmitDialogOpen: (isOpen: boolean) => void;
}

export function QuestionPalette({
    questions,
    answers,
    markedForReview,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    setIsSubmitDialogOpen
}: QuestionPaletteProps) {
    
    const getQuestionStatus = (questionId: number) => {
        const isAnswered = answers[questionId] !== undefined;
        const isMarked = markedForReview.includes(questionId);
        if (isAnswered && isMarked) return 'answeredAndMarked';
        if (isAnswered) return 'answered';
        if (isMarked) return 'marked';
        return 'unanswered';
    };

    return (
        <div className="flex flex-col h-full bg-card rounded-lg shadow-lg">
            <CardHeader className="p-4 border-b flex-shrink-0">
                <CardTitle className="font-bold text-lg font-headline">Question Palette</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-grow p-4 overflow-y-auto">
                <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-6 gap-2">
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
            </CardContent>

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
}
