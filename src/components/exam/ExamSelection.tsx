
"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import * as React from "react";
import { exams } from "@/lib/exams";
import { Skeleton } from "../ui/skeleton";
import { useState, useEffect } from "react";
import { CheckCircle, Brain } from "lucide-react";

const ExamSelectionSkeleton = () => (
    <div id="exam-selection-skeleton" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
             <div key={i} className="flex flex-col justify-between p-6 border rounded-lg bg-background h-48">
                 <div className="space-y-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                 </div>
                 <div className="space-y-2 mt-4">
                    <Skeleton className="h-5 w-1/2" />
                 </div>
             </div>
        ))}
    </div>
);


export function ExamSelection() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); // Short delay to show skeleton
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <ExamSelectionSkeleton />;
    }

    return (
        <div id="exam-selection" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const IconComponent = exam.icon;
              return (
               <Link key={exam.slug} href={`/exams/${exam.slug}`} passHref className="flex">
                 <Card className="w-full flex flex-col justify-between hover:border-primary hover:shadow-lg transition-all duration-200 bg-background/50 dark:bg-card">
                    <CardHeader>
                        <div className="p-3 bg-primary/10 rounded-lg w-fit mb-2">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-headline text-foreground whitespace-normal">{exam.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground space-y-2">
                             <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-accent" />
                                <span>TG & AP Mock Tests Available</span>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
               </Link>
              )
            })}
        </div>
    );
}
