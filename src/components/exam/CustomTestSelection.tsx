"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ArrowRight } from "lucide-react";
import type { Exam } from "@/lib/exams";

interface CustomTestSelectionProps {
  exam: Exam;
}

export function CustomTestSelection({ exam }: CustomTestSelectionProps) {
    const router = useRouter();
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    const handleSubjectChange = (subject: string, checked: boolean) => {
        setSelectedSubjects(prev => 
            checked ? [...prev, subject] : prev.filter(s => s !== subject)
        );
    };

    const handleStartTest = () => {
        // Here you would typically filter the main question bank based on selected subjects
        // and then navigate to the exam page.
        // For now, we'll just navigate to the generic exam page.
        router.push('/exam');
    };

    return (
        <div id="custom-test-selection" className="container mx-auto px-4">
            <Card className="shadow-lg max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">
                      Create a Custom Test
                    </CardTitle>
                    <CardDescription>Select the subjects you want to be tested on for {exam.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {exam.subjects.map((subject) => (
                            <div key={subject} className="flex items-center space-x-2 p-3 bg-card rounded-lg border">
                                <Checkbox 
                                    id={subject}
                                    onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                                />
                                <Label htmlFor={subject} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {subject}
                                </Label>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button 
                        onClick={handleStartTest} 
                        disabled={selectedSubjects.length === 0}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                        Start Custom Test <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
