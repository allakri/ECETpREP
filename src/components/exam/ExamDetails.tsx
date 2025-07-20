"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, FileText, ArrowRight } from "lucide-react";
import * as React from "react";

const papers = [
    { year: "2024", type: "Previous Paper" },
    { year: "2023", type: "Previous Paper" },
    { year: "2022", type: "Previous Paper" },
    { year: "2021", type: "Previous Paper" },
    { year: "2020", type: "Previous Paper" },
    { year: "Custom", type: "Mock Test" },
];

interface ExamDetailsProps {
  examName: string;
}

export function ExamDetails({ examName }: ExamDetailsProps) {
    const router = useRouter();

    const handlePaperSelect = () => {
        router.push('/exam');
    };

    return (
        <div id="exam-details" className="container mx-auto px-4">
            <Card className="shadow-lg max-w-4xl mx-auto border-none bg-transparent">
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
                                onClick={handlePaperSelect}
                                variant="outline"
                                className="w-full h-auto py-6 px-4 flex flex-col items-start justify-center text-left gap-3 bg-card hover:bg-card/90 hover:scale-105 transition-transform duration-200"
                            >
                                <div className="flex justify-between w-full items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        {paper.year === 'Custom' ? <FileText className="h-5 w-5 text-primary/80"/> : <Calendar className="h-5 w-5 text-primary/80"/>}
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
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
