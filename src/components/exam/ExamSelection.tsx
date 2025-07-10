"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { FlaskConical, CircuitBoard, Building, Code, TestTube, Zap, HardHat, Pickaxe, Radio, Sigma, ThumbsUp } from "lucide-react";

const exams = [
    { name: "Pharmacy", icon: <FlaskConical /> },
    { name: "Electronics and Instrumentation Engineering", icon: <CircuitBoard /> },
    { name: "Civil Engineering", icon: <Building /> },
    { name: "Computer Science and Engineering", icon: <Code /> },
    { name: "Chemical Engineering", icon: <TestTube /> },
    { name: "Electrical and Electronics Engineering", icon: <Zap /> },
    { name: "Mechanical Engineering", icon: <HardHat /> },
    { name: "Metallurgical Engineering", icon: <Pickaxe /> },
    { name: "Electronics and Communication Engineering", icon: <Radio /> },
    { name: "B.Sc.(Mathematics)", icon: <Sigma /> },
];

export function ExamSelection() {
    const router = useRouter();

    const handleExamSelect = () => {
        router.push('/exam');
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline text-primary">Mock Test</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {exams.map((exam) => (
                            <li key={exam.name}>
                                <Button
                                    onClick={handleExamSelect}
                                    variant="ghost"
                                    className="w-full justify-start text-left h-auto py-3 px-4 hover:bg-primary/5"
                                >
                                    <ThumbsUp className="mr-3 text-primary"/>
                                    <span className="text-base text-foreground">{exam.name}</span>
                                </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
