"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { FlaskConical, CircuitBoard, Building, Code, TestTube, Zap, HardHat, Pickaxe, Radio, Sigma } from "lucide-react";
import * as React from "react";

const exams = [
    { name: "Pharmacy", icon: <FlaskConical className="h-6 w-6 text-primary/80"/> },
    { name: "Electronics & Instrumentation", icon: <CircuitBoard className="h-6 w-6 text-primary/80"/> },
    { name: "Civil Engineering", icon: <Building className="h-6 w-6 text-primary/80"/> },
    { name: "Computer Science", icon: <Code className="h-6 w-6 text-primary/80"/> },
    { name: "Chemical Engineering", icon: <TestTube className="h-6 w-6 text-primary/80"/> },
    { name: "Electrical & Electronics", icon: <Zap className="h-6 w-6 text-primary/80"/> },
    { name: "Mechanical Engineering", icon: <HardHat className="h-6 w-6 text-primary/80"/> },
    { name: "Metallurgical Engineering", icon: <Pickaxe className="h-6 w-6 text-primary/80"/> },
    { name: "Electronics & Communication", icon: <Radio className="h-6 w-6 text-primary/80"/> },
    { name: "B.Sc. (Mathematics)", icon: <Sigma className="h-6 w-6 text-primary/80"/> },
];

export function ExamSelection() {
    const router = useRouter();

    const handleExamSelect = () => {
        router.push('/exam');
    };

    return (
        <div id="exam-selection" className="container mx-auto py-16 md:py-24 px-4">
            <Card className="shadow-lg max-w-4xl mx-auto border-none bg-secondary/30">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">Select Your Mock Test</CardTitle>
                    <CardDescription>Choose your branch to start a tailored practice exam.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exams.map((exam) => (
                            <Button
                                key={exam.name}
                                onClick={handleExamSelect}
                                variant="outline"
                                className="w-full h-auto py-6 px-4 flex flex-col items-center justify-center text-center gap-3 bg-card hover:bg-card/90 hover:scale-105 transition-transform duration-200"
                            >
                                {exam.icon}
                                <span className="text-base font-semibold text-foreground whitespace-normal">{exam.name}</span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
