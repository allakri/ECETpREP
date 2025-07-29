
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WifiOff, Trash2, DownloadCloud, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface OfflineTest {
    key: string;
    examName: string;
    examSlug: string;
    year: string;
    downloadedAt: string;
}

export default function OfflineExamsPage() {
    const router = useRouter();
    const [offlineTests, setOfflineTests] = useState<OfflineTest[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const indexKey = 'offline-tests-index';
        const savedIndex = localStorage.getItem(indexKey);
        if (savedIndex) {
            setOfflineTests(JSON.parse(savedIndex));
        }
    }, []);

    const handleStartTest = (testKey: string) => {
        const params = new URLSearchParams({
            offlineTestKey: testKey,
        });
        router.push(`/exam/instructions?${params.toString()}`);
    };

    const handleDeleteTest = (testKey: string) => {
        // Remove from index
        const indexKey = 'offline-tests-index';
        const updatedIndex = offlineTests.filter(t => t.key !== testKey);
        setOfflineTests(updatedIndex);
        localStorage.setItem(indexKey, JSON.stringify(updatedIndex));
        
        // Remove test data
        localStorage.removeItem(testKey);
    };
    
    if (!isMounted) {
        return null; // or a skeleton loader
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <AppHeader />
            <main className="flex-grow bg-secondary/20 py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <Card className="max-w-3xl mx-auto shadow-lg">
                        <CardHeader className="text-center">
                            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                                <WifiOff className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-3xl font-headline text-primary">Downloaded Tests</CardTitle>
                            <CardDescription>
                                These tests are saved on your device and can be taken without an internet connection.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {offlineTests.length > 0 ? (
                                <div className="space-y-4">
                                    {offlineTests.map(test => (
                                        <div key={test.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-background gap-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{test.examName} - {test.year}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Downloaded {formatDistanceToNow(new Date(test.downloadedAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 self-end sm:self-center">
                                                <Button onClick={() => handleStartTest(test.key)}>
                                                    <Play className="mr-2 h-4 w-4" /> Start
                                                </Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="destructive" size="icon">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will delete the offline data for the {test.examName} ({test.year}) test. You will need to download it again for offline access.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive hover:bg-destructive/90"
                                                                onClick={() => handleDeleteTest(test.key)}
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                                    <DownloadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="font-semibold">No offline tests found.</p>
                                    <p className="text-muted-foreground mb-4">Go to an exam page and click the download button to save a test for offline use.</p>
                                    <Button onClick={() => router.push('/exams')}>Browse Exams</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
