
"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { exams } from "@/lib/exams";
import { Skeleton } from "../ui/skeleton";
import { useState, useEffect } from "react";

const ExamSelectionSkeleton = () => (
    <div id="exam-selection-skeleton" className="container mx-auto px-4">
        <Card className="shadow-lg max-w-4xl lg:max-w-6xl mx-auto bg-card">
            <CardHeader className="text-center">
                <Skeleton className="h-9 w-1/2 mx-auto mb-2" />
                <Skeleton className="h-5 w-3/4 mx-auto" />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, i) => (
                         <div key={i} className="flex items-center justify-between p-6 lg:p-8 border rounded-lg bg-background">
                             <div className="flex items-center gap-4">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-6 w-40" />
                             </div>
                             <Skeleton className="h-6 w-6" />
                         </div>
                    ))}
                </div>
            </CardContent>
        </Card>
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
        <div id="exam-selection" className="container mx-auto px-4">
            <Card className="shadow-lg max-w-4xl lg:max-w-6xl mx-auto bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">Select Your Branch</CardTitle>
                    <CardDescription>Choose your branch to see available practice exams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => {
                          const IconComponent = exam.icon;
                          return (
                           <Link key={exam.slug} href={`/exams/${exam.slug}`} passHref>
                             <Button
                                variant="outline"
                                className="w-full h-auto py-6 lg:py-8 px-4 flex items-center justify-between text-left gap-3 bg-background hover:bg-muted/50 hover:scale-105 transition-transform duration-200"
                              >
                               <div className="flex items-center gap-4">
                                <IconComponent className="h-7 w-7 lg:h-8 lg:w-8 text-primary/80" />
                                <span className="text-base lg:text-lg font-semibold text-foreground whitespace-normal">{exam.name}</span>
                               </div>
                               <ArrowRight className="h-6 w-6 text-muted-foreground/50"/>
                              </Button>
                           </Link>
                          )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
