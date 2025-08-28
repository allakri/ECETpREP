
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Check, AlertTriangle, Clock, MousePointerSquareDashed, ArrowRight, Fullscreen } from "lucide-react";
import { motion } from "framer-motion";
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


const instructions = [
  { icon: Clock, text: "The exam has a duration of 2 hours. The timer will start as soon as you click 'Start Exam'." },
  { icon: AlertTriangle, text: "Do not switch tabs or minimize the browser window. Doing so multiple times will result in automatic submission." },
  { icon: Check, text: "Ensure you have a stable internet connection throughout the exam." },
  { icon: MousePointerSquareDashed, text: "Your answers are saved automatically when you select an option. You can change your answers anytime before final submission." }
];

export default function ExamInstructionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStartExam = () => {
    // Request fullscreen, then navigate
    document.documentElement.requestFullscreen().catch(err => {
      console.warn(`Fullscreen request failed: ${err.message}. Proceeding without fullscreen.`);
    }).finally(() => {
        router.push(`/exam?${searchParams.toString()}`);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-2xl shadow-2xl border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline text-primary">Exam Instructions</CardTitle>
              <CardDescription>Please read the following instructions carefully before starting the exam.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                {instructions.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
                    >
                      <Icon className="h-6 w-6 text-accent shrink-0 mt-1" />
                      <span className="text-foreground">{item.text}</span>
                    </motion.li>
                  );
                })}
              </ul>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
                <p className="font-semibold text-primary">Wishing you all the very best for your exam. Stay calm and focused!</p>
              </div>
            </CardContent>
            <div className="p-6 flex justify-center">
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="lg" className="font-bold text-lg">
                        Start Exam <ArrowRight className="ml-2 h-5 w-5" />
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
          </Card>
        </motion.div>
      </main>
      <AppFooter />
    </div>
  );
}
