
"use client"

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, FileText, ArrowRight, Download, WifiOff } from "lucide-react";
import * as React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

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
    const [downloading, setDownloading] = React.useState<string | null>(null);

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
        router.push(`/exams/${examSlug}/custom`);
    }

    const handleDownloadTest = async (year: string) => {
        setDownloading(year);
        try {
            const filePath = `/datasets/${examSlug}_${year}.json`;
            const response = await fetch(filePath);
            if (!response.ok) throw new Error("Failed to fetch question paper.");
            const questions = await response.json();

            // Save questions to localStorage
            const testKey = `offline-test-${examSlug}-${year}`;
            localStorage.setItem(testKey, JSON.stringify(questions));

            // Add to offline index
            const indexKey = 'offline-tests-index';
            const existingIndex = JSON.parse(localStorage.getItem(indexKey) || '[]');
            const newIndexEntry = {
                key: testKey,
                examName,
                examSlug,
                year,
                downloadedAt: new Date().toISOString(),
            };
            // Remove old entry if it exists to prevent duplicates
            const updatedIndex = existingIndex.filter((item: any) => item.key !== testKey);
            updatedIndex.push(newIndexEntry);
            localStorage.setItem(indexKey, JSON.stringify(updatedIndex));

            toast({
                title: "Download Complete!",
                description: `${examName} (${year}) is now available offline.`,
            });
        } catch (error) {
            console.error("Failed to download test:", error);
            toast({
                title: "Download Failed",
                description: "Could not download the test. Please check your connection and try again.",
                variant: "destructive",
            });
        } finally {
            setDownloading(null);
        }
    };


    return (
        <div id="exam-details" className="container mx-auto px-4">
            <Card className="shadow-lg max-w-4xl mx-auto bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">
                      {examName}
                    </CardTitle>
                    <CardDescription>Select a paper to begin your test, or download it for offline use.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center mb-6">
                         <Button asChild variant="secondary">
                            <Link href="/exams/offline">
                                <WifiOff className="mr-2 h-4 w-4" /> Go to Offline Tests
                            </Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {papers.map((paper) => (
                            <div key={paper.year} className="p-4 border rounded-lg bg-background hover:shadow-lg transition-shadow duration-200 flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <Calendar className="h-5 w-5 text-primary/80"/>
                                    </div>
                                    <div>
                                        <p className="text-base font-semibold text-foreground">{paper.year} Paper</p>
                                        <p className="text-sm text-muted-foreground">{paper.type}</p>
                                    </div>
                                </div>
                                <div className="flex-grow"></div>
                                <div className="flex gap-2 w-full">
                                    <Button
                                        onClick={() => handlePaperSelect(paper.year)}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        Start Test <ArrowRight className="ml-2 h-4 w-4"/>
                                    </Button>
                                    <Button
                                        onClick={() => handleDownloadTest(paper.year)}
                                        variant="outline"
                                        disabled={downloading === paper.year}
                                        className="w-full"
                                    >
                                        <Download className="mr-2 h-4 w-4"/> {downloading === paper.year ? 'Downloading...' : 'Offline'}
                                    </Button>
                                </div>
                            </div>
                        ))}
                         <div className="p-4 border rounded-lg bg-background hover:shadow-lg transition-shadow duration-200 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-md">
                                    <FileText className="h-5 w-5 text-primary/80"/>
                                </div>
                                <div>
                                    <p className="text-base font-semibold text-foreground">Custom Paper</p>
                                    <p className="text-sm text-muted-foreground">Mock Test</p>
                                </div>
                            </div>
                            <div className="flex-grow"></div>
                            <Button
                                onClick={handleCustomPaperSelect}
                                className="w-full"
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
