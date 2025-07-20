"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import * as React from "react";
import { exams } from "@/lib/exams";

export function ExamSelection() {
    return (
        <div id="exam-selection" className="container mx-auto px-4">
            <Card className="shadow-lg max-w-4xl mx-auto bg-card">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-headline text-primary">Select Your Branch</CardTitle>
                    <CardDescription>Choose your branch to see available practice exams.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {exams.map((exam) => {
                          const IconComponent = exam.icon;
                          return (
                           <Link key={exam.slug} href={`/exams/${exam.slug}`} passHref>
                             <Button
                                variant="outline"
                                className="w-full h-auto py-6 px-4 flex items-center justify-between text-left gap-3 bg-background hover:bg-muted/50 hover:scale-105 transition-transform duration-200"
                              >
                               <div className="flex items-center gap-3">
                                <IconComponent className="h-6 w-6 text-primary/80" />
                                <span className="text-base font-semibold text-foreground whitespace-normal">{exam.name}</span>
                               </div>
                               <ArrowRight className="h-5 w-5 text-muted-foreground/50"/>
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
