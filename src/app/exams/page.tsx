"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamSelection } from "@/components/exam/ExamSelection";
import { GovtExamSelection } from "@/components/exam/GovtExamSelection";
import { GraduationCap, Briefcase } from "lucide-react";


export default function ExamsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12">
        <div className="container mx-auto px-4">
            <Tabs defaultValue="ecet" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto mb-8 bg-card border">
                <TabsTrigger value="ecet" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base py-2">
                  <GraduationCap className="mr-2 h-5 w-5"/> ECET Practice Exams
                </TapsTrigger>
                <TabsTrigger value="govt" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-base py-2">
                  <Briefcase className="mr-2 h-5 w-5"/> Government Exams
                </TapsTrigger>
              </TabsList>
              <TabsContent value="ecet">
                <Card className="shadow-lg max-w-4xl lg:max-w-6xl mx-auto bg-card">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-headline text-primary">ECET Practice Exams by Branch</CardTitle>
                        <CardDescription>Select your diploma branch to start preparing for ECET with branch-specific mock tests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ExamSelection />
                    </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="govt">
                 <Card className="shadow-lg max-w-4xl lg:max-w-6xl mx-auto bg-card">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-headline text-primary">Explore Government Exams</CardTitle>
                        <CardDescription>These exams open doors to public sector jobs after your diploma. Start preparing with our curated tests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GovtExamSelection />
                    </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
