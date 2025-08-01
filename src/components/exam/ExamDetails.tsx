

"use client"

import { useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, FileText, ArrowRight, Sparkles, Clock, HelpCircle, Award, Map } from "lucide-react";
import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const papers = [
    { year: "2025", type: "Latest Pattern", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2024", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2023", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2022", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2021", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2020", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2019", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2018", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
];

interface ExamDetailsProps {
  examName: string;
  examSlug: string;
}

export function ExamDetails({ examName, examSlug }: ExamDetailsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const { toast } = useToast();
    const [selectedState, setSelectedState] = useState<"TS" | "AP" | null>(null);

    const handlePaperSelect = (year: string) => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to start an exam.",
                variant: "destructive",
            });
            router.push('/login');
            return;
        }
        
        const params = new URLSearchParams({
            examName: `${selectedState} ECET ${examName}`,
            examSlug: examSlug,
            year: year
        });
        router.push(`/exam/instructions?${params.toString()}`);
    };
    
    const handleCustomPaperSelect = () => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to create a custom test.",
                variant: "destructive",
            });
            router.push('/login');
            return;
        }
        router.push(`${pathname}/custom`);
    }

    const renderYearSelection = () => (
         <motion.div
            key="year-selection"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
        >
            <CardHeader className="text-center">
                <Button variant="link" onClick={() => setSelectedState(null)} className="absolute top-4 left-4">
                    <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Back
                </Button>
                <CardTitle className="text-3xl font-headline text-primary">
                  {selectedState} ECET: {examName}
                </CardTitle>
                <CardDescription>Select a paper to begin your test, or create a custom one with AI.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {papers.map((paper) => (
                        <div key={paper.year} className="p-4 border rounded-lg bg-background hover:shadow-lg transition-shadow duration-200 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <Calendar className="h-5 w-5 text-primary/80"/>
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-foreground">{paper.year} Paper</p>
                                    <p className="text-sm text-muted-foreground">{paper.type}</p>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-2 mt-2 flex-grow">
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4" />
                                    <span>{paper.questions} Questions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{paper.duration} Duration</span>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    <span>{paper.marks} Marks</span>
                                </div>
                            </div>
                            
                            <Button
                                onClick={() => handlePaperSelect(paper.year)}
                                className="w-full mt-2"
                            >
                                Start Test <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                     <div className="p-4 border-2 border-dashed border-accent/50 rounded-lg bg-accent/5 hover:shadow-lg transition-shadow duration-200 flex flex-col gap-3 justify-center items-center text-center">
                        <div className="p-3 bg-accent/10 rounded-full">
                            <Sparkles className="h-6 w-6 text-accent"/>
                        </div>
                        <p className="text-lg font-bold text-foreground">AI Custom Quiz</p>
                        <p className="text-sm text-muted-foreground -mt-2">Generate a personalized test based on topics and difficulty.</p>
                        
                        <div className="flex-grow"></div>
                        <Button
                            onClick={handleCustomPaperSelect}
                            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                            Create & Start <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </motion.div>
    );

    const renderStateSelection = () => (
        <motion.div
            key="state-selection"
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
        >
            <CardHeader>
                <CardTitle className="text-3xl font-headline text-primary">
                    Select Your State Board
                </CardTitle>
                <CardDescription>Choose the appropriate EAPCET / ECET board for {examName}.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center gap-8">
                <Button size="lg" variant="outline" className="h-24 w-48 text-xl flex-col gap-2" onClick={() => setSelectedState('TS')}>
                    <Map className="h-6 w-6" />
                    TS ECET
                </Button>
                <Button size="lg" variant="outline" className="h-24 w-48 text-xl flex-col gap-2" onClick={() => setSelectedState('AP')}>
                    <Map className="h-6 w-6" />
                    AP ECET
                </Button>
            </CardContent>
        </motion.div>
    );

    return (
        <div id="exam-details" className="container mx-auto px-4">
            <Card className="shadow-lg max-w-4xl mx-auto bg-card overflow-hidden">
                <AnimatePresence mode="wait">
                    {selectedState ? renderYearSelection() : renderStateSelection()}
                </AnimatePresence>
            </Card>
        </div>
    );
}
