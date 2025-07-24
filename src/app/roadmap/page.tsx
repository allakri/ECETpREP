
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Download, Lightbulb, Target } from "lucide-react";

const guideSections = [
    {
        title: "1. Understanding the Exam",
        icon: Target,
        content: (
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                <h4>1.1 Syllabus Analysis</h4>
                <ul>
                    <li>Obtain the latest official syllabus from the exam body's website or brochure.</li>
                    <li>Break it down into sections and topics, noting marks distribution and subject weightage.</li>
                    <li>Compare with previous years' question papers to spot recurring themes and important topics.</li>
                </ul>
                <h4>1.2 Exam Pattern and Marking Scheme</h4>
                <ul>
                    <li>Identify the number of questions, sections, negative marking rules, and time duration.</li>
                    <li>Focus on high-weightage topics to prioritize them in your study plan.</li>
                </ul>
            </div>
        )
    },
    {
        title: "2. Creating a Study Plan & Roadmap",
        icon: Target,
        content: (
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                <h4>2.1 Initial Planning</h4>
                <ul>
                    <li>Allocate 1 week at the start for a full syllabus breakdown and to identify your weak/strong areas.</li>
                    <li>Set clear, achievable targets for each week and month to stay on track.</li>
                </ul>
                <h4>2.2 Time Management & Study Hours</h4>
                <p>A typical preparation period of 6-9 months is ideal. The duration can be broken down as follows:</p>
                <ul>
                    <li><strong>Syllabus Analysis:</strong> 1 week</li>
                    <li><strong>Foundation Building:</strong> 1-2 months</li>
                    <li><strong>Intensive Prep:</strong> 3-5 months</li>
                    <li><strong>Assessment & Mocks:</strong> 2 months (in parallel)</li>
                    <li><strong>Final Revision:</strong> Last month</li>
                </ul>
            </div>
        )
    },
    {
        title: "3. Study Techniques & Strategies",
        icon: Lightbulb,
        content: (
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                <h4>3.1 Smart Study Techniques</h4>
                <ul>
                    <li><strong>Daily Schedule:</strong> Allocate 4-6 focused study hours per day.</li>
                    <li><strong>Focused Sessions:</strong> Use the Pomodoro Technique (25-30min study, 5min breaks) to maintain concentration.</li>
                    <li><strong>Active Learning:</strong> Don't just read. Solve questions, explain concepts aloud, and create mind maps.</li>
                </ul>
                <h4>3.2 Resources & Materials</h4>
                <ul>
                    <li>Rely on official textbooks and at least 5+ years of previous question papers.</li>
                    <li>Use online lectures and our platform's test series for comprehensive preparation.</li>
                </ul>
            </div>
        )
    },
    {
        title: "9. Key Takeaways",
        icon: CheckCircle2,
        content: (
          <ul className="space-y-3 prose dark:prose-invert max-w-none text-muted-foreground">
              <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/><span>Begin early with a clear, structured roadmap to guide your efforts.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/><span>Revise systematically using active recall methods to ensure long-term retention.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/><span>Simulate real exam conditions with frequent mock tests to build confidence and time management skills.</span></li>
              <li className="flex items-start gap-3"><CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/><span>Prioritize your health and well-being; a rested mind is a productive mind.</span></li>
          </ul>
      )
  }
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    },
  },
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export default function RoadmapPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background">
        {/* Hero Section */}
        <motion.div 
            className="text-center py-20 px-4 bg-primary/5"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl font-headline">
                Your Personalized Path to Success
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
              A step-by-step, time-tested guide built by exam experts and toppers to help you ace the ECET & other government exams.
            </p>
            <Button size="lg" className="mt-8">
                Start Your Journey
            </Button>
        </motion.div>
        
        <div className="container mx-auto px-4 py-16">
            {/* Main Content Card */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
            >
                <Card className="max-w-4xl mx-auto shadow-lg bg-card border-border">
                    <CardHeader className="flex flex-row items-center gap-4">
                         <div className="p-3 bg-accent/10 rounded-lg">
                            <BookOpen className="h-6 w-6 text-accent"/>
                         </div>
                        <CardTitle className="text-2xl font-headline text-primary">Exam Preparation Handbook</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {guideSections.map((section, index) => {
                          const Icon = section.icon;
                          return (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5 text-primary/80"/>
                                        <span>{section.title}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pl-4 border-l-2 border-primary/20 ml-4">
                                    {section.content}
                                </AccordionContent>
                            </AccordionItem>
                          )
                        })}
                      </Accordion>
                    </CardContent>
                  </Card>
              </motion.div>

              {/* Downloadable Resources Section */}
              <motion.div
                className="max-w-4xl mx-auto mt-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={itemVariants}
               >
                 <Card className="bg-secondary/10 border-secondary/20">
                    <CardHeader>
                        <CardTitle className="font-headline text-secondary">Downloadable Resources</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Study Planner PDF</Button>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Formula Mind Maps</Button>
                        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Subject Checklist</Button>
                    </CardContent>
                 </Card>
              </motion.div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
