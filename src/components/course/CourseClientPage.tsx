

"use client";

import Link from "next/link";
import { Home, ChevronRight, Download, Brain, Clock, ShieldQuestion, BookCopy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Course } from "@/lib/courses";
import { Breadcrumbs } from "../layout/Breadcrumbs";

interface CourseClientPageProps {
  course: Omit<Course, 'icon'>;
  icon: React.ReactNode;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function CourseClientPage({ course, icon }: CourseClientPageProps) {

  return (
    <div className="flex flex-col min-h-screen bg-secondary/10">
      <main className="flex-grow bg-background py-12 md:py-20">
        <Breadcrumbs className="mb-0 pt-0" />
        <div className="container mx-auto px-4">
          {/* Top Banner */}
          <motion.div initial="hidden" animate="visible" variants={itemVariants}>
            <Card className="mb-12 shadow-lg bg-card border-border mt-8">
                <CardHeader className="flex flex-col md:flex-row items-start gap-6">
                    <div className="p-4 bg-primary/10 rounded-lg">
                        {icon}
                    </div>
                    <div>
                        <CardTitle className="text-3xl lg:text-4xl font-headline text-primary">
                            {course.title} – ECET Syllabus & Course Guide
                        </CardTitle>
                        <CardDescription className="text-lg mt-2">
                            Structured roadmap, key topics, and preparation tips for diploma students aiming for ECET.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
          </motion.div>
          

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-3">
              {/* Syllabus Section */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
                <Card className="mb-8 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-3"><BookCopy /> Complete Syllabus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {course.syllabus.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                          <AccordionTrigger className="text-lg font-semibold hover:no-underline">{item.subject}</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside pl-4 space-y-2 text-muted-foreground">
                              {item.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
              
               {/* Key Prep Tips */}
               <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-headline flex items-center gap-3"><ShieldQuestion /> Key Preparation Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-background rounded-lg border">
                                <h4 className="font-semibold">Focus on Fundamentals</h4>
                                <p className="text-sm text-muted-foreground">Master the core concepts before moving to complex problems.</p>
                            </div>
                            <div className="p-4 bg-background rounded-lg border">
                                <h4 className="font-semibold">Previous Year Papers</h4>
                                <p className="text-sm text-muted-foreground">Solve at least 5 years of past papers to understand the pattern.</p>
                            </div>
                            <div className="p-4 bg-background rounded-lg border">
                                <h4 className="font-semibold">Time Management</h4>
                                <p className="text-sm text-muted-foreground">Practice timed mock tests to improve speed and accuracy.</p>
                            </div>
                            <div className="p-4 bg-background rounded-lg border">
                                <h4 className="font-semibold">Consistent Revision</h4>
                                <p className="text-sm text-muted-foreground">Regularly revise formulas and key concepts to retain information.</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Sticky Sidebar */}
            <aside className="lg:col-span-1 lg:sticky top-24 self-start space-y-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Clock/> Study Plan</CardTitle>
                    <CardDescription>A suggested 4-week roadmap.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {["Week 1: Core Concepts", "Week 2: Advanced Topics", "Week 3: Practice & Mocks", "Week 4: Revision"].map((item, i) => (
                        <div key={i} className="flex items-center text-sm p-2 bg-muted/50 rounded-md">
                            <ChevronRight className="h-4 w-4 mr-2 text-primary"/>
                            <span>{item}</span>
                        </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Download/> Downloadables</CardTitle>
                    <CardDescription>Get useful resources.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-2"><Download className="h-4 w-4"/> Syllabus PDF</Button>
                    <Button variant="outline" className="w-full justify-start gap-2"><Download className="h-4 w-4"/> Practice MCQs</Button>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
                <Card className="shadow-lg bg-primary/10 border-primary/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Brain /> AI Doubt Corner</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">Stuck on a topic? Get instant help from our AI tutor.</p>
                        <Button className="w-full" asChild>
                            <Link href="/chat">Ask AI Assistant</Link>
                        </Button>
                    </CardContent>
                </Card>
              </motion.div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
