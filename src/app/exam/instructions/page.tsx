
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Check, AlertTriangle, Clock, FileText, ArrowRight, Fullscreen, BookCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const details = [
    { icon: Clock, text: "Duration: 2 hours (120 minutes)" },
    { icon: FileText, text: "Total Questions: 200" },
    { icon: BookCheck, text: "Multiple Choice Questions (MCQ)" },
];

const instructions = [
    "Each question has 4 options (A, B, C, D)",
    "You can mark questions for review",
    "Navigate between questions freely",
    "Submit before time expires",
    "Auto-submit when time is up"
];


const InstructionsPageSkeleton = () => (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl shadow-lg">
             <CardHeader className="bg-primary text-primary-foreground p-4">
                <Skeleton className="h-8 w-1/3" />
             </CardHeader>
             <CardContent className="p-6 md:p-8 space-y-6">
                <Skeleton className="h-16 w-full" />
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
                 <Skeleton className="h-12 w-full" />
                 <div className="text-center pt-4">
                    <Skeleton className="h-12 w-48 mx-auto" />
                 </div>
             </CardContent>
          </Card>
      </main>
      <AppFooter />
    </div>
);


export default function ExamInstructionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStartExam = () => {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn(`Fullscreen request failed: ${err.message}. Proceeding without fullscreen.`);
    }).finally(() => {
        router.push(`/exam?${searchParams.toString()}`);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/20">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <motion.div
          className="w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-border overflow-hidden">
            <CardHeader className="bg-primary text-primary-foreground p-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText />
                ECET Examination Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-8 bg-card">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Exam Details */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Exam Details</h3>
                  <ul className="space-y-3">
                    {details.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <li key={index} className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-muted-foreground">{item.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">Instructions</h3>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    {instructions.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-center gap-3 p-4 bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-300/50 dark:border-yellow-700/50">
                <AlertTriangle className="h-5 w-5" />
                <p className="font-medium">Once you start the exam, the timer will begin and cannot be paused. Make sure you have a stable internet connection.</p>
              </div>

              {/* Start Button */}
              <div className="text-center pt-4">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="lg" className="font-bold text-lg bg-green-600 hover:bg-green-700 text-white px-8 py-6">
                            Start Examination <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Fullscreen className="h-6 w-6" /> Fullscreen Exam Mode
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            For the best experience and to simulate a real testing environment, this exam will start in fullscreen mode. Please click 'Continue' to proceed.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleStartExam}>
                            Continue
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <AppFooter />
    </div>
  );
}
