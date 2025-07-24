
"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { govtExams, ExamCategory } from "@/lib/govtexams";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "../ui/badge";
import { Brain, FileText, Clock, Users } from "lucide-react";


const GovtExamSelectionSkeleton = () => (
    <div className="space-y-8">
        {[...Array(2)].map((_, i) => (
            <div key={i}>
                <Skeleton className="h-8 w-1/3 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, j) => (
                        <Skeleton key={j} className="h-48 w-full" />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const GuidanceBox = () => (
    <Card className="bg-primary/5 border-primary/20 mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
            <Brain className="h-8 w-8 text-primary" />
            <div>
                <CardTitle>Not sure what to choose?</CardTitle>
                <CardDescription>Let our AI recommend the best exam path for you.</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
            <Button>Take 1-Minute Quiz</Button>
        </CardContent>
    </Card>
)

export function GovtExamSelection() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <GovtExamSelectionSkeleton />;
    }

    const renderExams = (category: ExamCategory) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.exams.map(exam => (
                <Card key={exam.name} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="text-xl font-headline text-primary">{exam.name}</CardTitle>
                        <CardDescription>{exam.organization}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span>{exam.mockTestsAvailable} Mock Tests</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{exam.duration}</span>
                        </div>
                         <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Ideal for: {exam.idealFor.join(', ')}</span>
                        </div>
                        <div className="pt-2">
                             <Button variant="outline" className="w-full">View Syllabus & Tests</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            <Accordion type="multiple" defaultValue={govtExams.map(g => g.title)} className="w-full">
                {govtExams.map(category => (
                    <AccordionItem value={category.title} key={category.title}>
                        <AccordionTrigger className="text-2xl font-headline text-foreground hover:no-underline">
                           <div className="flex items-center gap-3">
                             <category.icon className="h-6 w-6 text-accent" />
                             {category.title}
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                            {renderExams(category)}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <GuidanceBox />
        </div>
    );
}
