
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExamSelection } from "@/components/exam/ExamSelection";
import { GovtExamSelection } from "@/components/exam/GovtExamSelection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Briefcase } from "lucide-react";


export default function ExamsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12">
        <div className="container mx-auto px-4">
            <Card className="shadow-lg max-w-4xl lg:max-w-6xl mx-auto bg-card">
                 <Tabs defaultValue="ecet" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-14">
                        <TabsTrigger value="ecet" className="text-lg font-headline h-full">
                            <GraduationCap className="mr-2"/> ECET Practice Exams
                        </TabsTrigger>
                        <TabsTrigger value="govt" className="text-lg font-headline h-full">
                            <Briefcase className="mr-2"/> Government Exams
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="ecet">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-headline text-primary">ECET Practice Exams by Branch</CardTitle>
                            <CardDescription>Select your diploma branch to start preparing for ECET with branch-specific mock tests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <ExamSelection />
                        </CardContent>
                    </TabsContent>
                    <TabsContent value="govt">
                         <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-headline text-primary">Explore Government Exams</CardTitle>
                            <CardDescription>These exams open doors to public sector jobs after your diploma. Start preparing with our curated tests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <GovtExamSelection />
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
