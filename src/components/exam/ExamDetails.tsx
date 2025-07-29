

"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, FileText, ArrowRight, Sparkles, Clock, HelpCircle, Award } from "lucide-react";
import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { usePathname } from 'next/navigation'


const papers = [
    { year: "2024", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2023", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2022", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2021", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
    { year: "2020", type: "Previous Paper", questions: 100, duration: "2 Hours", marks: 100 },
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
        // Pass exam details to the instructions page
        const params = new URLSearchParams({
            examName: examName,
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

    return (
        <div id="exam-details" className="container mx-auto px-4">
            <Card className="shadow-lg max-w-4xl mx-auto bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">
                      {examName}
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
            </Card>
        </div>
    );
}
