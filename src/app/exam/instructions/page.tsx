
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Check, AlertTriangle, Clock, FileText, ArrowRight, Fullscreen, BookCheck } from "lucide-react";
import { motion } from "framer-motion";
import * as React from "react";
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
} from "@/components/ui/alert-dialog"

const details = [
    { icon: Clock, text: "Duration: 2 hours (120 minutes)" },
    { icon: FileText, text: "Total Questions: 200" },
    { icon: BookCheck, text: "Multiple Choice Questions (MCQ)" },
];

const instructions = [
    "The exam must be taken in fullscreen mode.",
    "Do not switch tabs or exit fullscreen.",
    "Switching tabs or exiting fullscreen 3 times will auto-submit the exam.",
    "The timer cannot be paused once started.",
];


export default function ExamInstructionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStartExam = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        // Listen for fullscreen change
        const fullscreenChangeHandler = () => {
            if (document.fullscreenElement) {
                router.push(`/exam?${searchParams.toString()}`);
                document.removeEventListener('fullscreenchange', fullscreenChangeHandler);
            }
        };
        document.addEventListener('fullscreenchange', fullscreenChangeHandler);
    } else {
        // Fallback for browsers that don't support the API
        router.push(`/exam?${searchParams.toString()}`);
    }
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
            <CardHeader className="bg-primary text-primary-foreground p-6">
              <CardTitle className="text-2xl flex items-center gap-3 font-headline">
                <FileText />
                ECET Examination Instructions
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Please read the following rules carefully before starting the exam.
              </CardDescription>
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
                  <h3 className="text-xl font-bold text-foreground">Rules & Instructions</h3>
                  <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    {instructions.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-4 p-4 bg-yellow-500/10 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-500/20">
                <AlertTriangle className="h-6 w-6 mt-1 flex-shrink-0" />
                <div className="text-sm">
                    <h4 className="font-bold">Important Notice</h4>
                    <p>The exam will start in fullscreen mode to ensure a fair testing environment. Any attempt to exit fullscreen or switch tabs will be counted as a violation and may lead to automatic submission.</p>
                </div>
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
                            <AlertDialogTitle>Enter Fullscreen Mode</AlertDialogTitle>
                            <AlertDialogDescription>
                                The exam requires fullscreen mode. Please click "Continue" to proceed.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleStartExam}>
                           <Fullscreen className="mr-2 h-4 w-4" /> Continue
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
