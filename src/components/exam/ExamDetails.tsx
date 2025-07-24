
"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, FileText, ArrowRight } from "lucide-react";
import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

const papers = [
    { year: "2024", type: "Previous Paper" },
    { year: "2023", type: "Previous Paper" },
    { year: "2022", type: "Previous Paper" },
    { year: "2021", type: "Previous Paper" },
    { year: "2020", type: "Previous Paper" },
];

interface ExamDetailsProps {
  examName: string;
  examSlug: string;
}

export function ExamDetails({ examName, examSlug }: ExamDetailsProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();

    const handlePaperSelect = (paperType: string) => {
        if (!user) {
            toast({
                title: "Authentication Required",
                description: "Please log in to start an exam.",
                variant: "destructive",
            });
            router.push('/login');
            return;
        }
        // All paper selections will now go to the instructions page first.
        router.push('/exam/instructions');
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
        router.push(`/exams/${examSlug}/custom`);
    }

    return (
        <div id="exam-details" className="container mx-auto px-4">
            <Card className="shadow-lg max-w-4xl mx-auto bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">
                      {examName}
                    </CardTitle>
                    <CardDescription>Select a paper to begin your test.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {papers.map((paper) => (
                            <Button
                                key={paper.year}
                                onClick={() => handlePaperSelect(paper.type)}
                                variant="outline"
                                className="w-full h-auto py-6 px-4 flex flex-col items-start justify-center text-left gap-3 bg-background hover:bg-muted/50 hover:scale-105 transition-transform duration-200"
                            >
                                <div className="flex justify-between w-full items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Calendar className="h-5 w-5 text-primary/80"/>
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-foreground">{paper.year} Paper</p>
                                        <p className="text-sm text-muted-foreground">{paper.type}</p>
                                    </div>
                                  </div>
                                  <ArrowRight className="h-5 w-5 text-muted-foreground/50"/>
                                </div>
                            </Button>
                        ))}
                         <Button
                            onClick={handleCustomPaperSelect}
                            variant="outline"
                            className="w-full h-auto py-6 px-4 flex flex-col items-start justify-center text-left gap-3 bg-background hover:bg-muted/50 hover:scale-105 transition-transform duration-200"
                        >
                            <div className="flex justify-between w-full items-center">
                                <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <FileText className="h-5 w-5 text-primary/80"/>
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-foreground">Custom Paper</p>
                                    <p className="text-sm text-muted-foreground">Mock Test</p>
                                </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground/50"/>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
