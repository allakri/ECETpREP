
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2 } from "lucide-react";

const guideSections = [
    {
        title: "1. Understanding the Exam",
        content: (
            <div className="prose dark:prose-invert max-w-none">
                <h4>1.1 Syllabus Analysis</h4>
                <ul>
                    <li>Obtain the latest official syllabus from the exam body's website or brochure.</li>
                    <li>Break it down into sections and topics.</li>
                    <li>Note marks distribution, subject weightage, and exam pattern.</li>
                    <li>Compare with previous years' question papers to spot recurring themes and topics.</li>
                </ul>
                <h4>1.2 Exam Pattern and Marking Scheme</h4>
                <ul>
                    <li>Identify: Number of questions, sections, negative marking, and time duration.</li>
                    <li>Focus on high-weightage topics; prioritize these in your study plan.</li>
                </ul>
            </div>
        )
    },
    {
        title: "2. Creating a Study Plan & Roadmap",
        content: (
            <div className="prose dark:prose-invert max-w-none">
                <h4>2.1 Initial Planning</h4>
                <ul>
                    <li>Allocate 1 week at the start for full syllabus breakdown and identifying weak/strong areas.</li>
                    <li>Set clear, achievable targets for each week and month.</li>
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
        content: (
            <div className="prose dark:prose-invert max-w-none">
                <h4>3.1 Smart Study Techniques</h4>
                <ul>
                    <li><strong>Daily Schedule:</strong> Allocate 4-6 study hours per day.</li>
                    <li><strong>Focused Sessions:</strong> Use Pomodoro Technique (25-30min study, 5min breaks).</li>
                    <li><strong>Active Learning:</strong> Solve questions, explain concepts aloud.</li>
                    <li><strong>Mind Maps & Short Notes:</strong> Summarize and connect major concepts.</li>
                </ul>
                <h4>3.2 Resources & Materials</h4>
                <ul>
                    <li>Official textbooks and previous 5+ years' question papers are essential.</li>
                    <li>Use online lectures, test series, and flashcards for supplementary preparation.</li>
                </ul>
            </div>
        )
    },
    {
        title: "4. Practice and Mock Testing",
        content: (
            <div className="prose dark:prose-invert max-w-none">
                <h4>4.1 Solving Previous Year Papers</h4>
                <p>Attempt at least one full paper under timed conditions every week during the last 3 months.</p>
                <h4>4.2 Mock Tests</h4>
                <p>Take sectional mocks regularly and switch to full-length mocks in the last two months.</p>
                <h4>4.3 Reviewing and Improving</h4>
                <p>Keep a progress tracker. Focus on accuracy, speed, and time allocation for each section.</p>
            </div>
        )
    },
    {
        title: "5. Revision Strategy",
        content: (
            <div className="prose dark:prose-invert max-w-none">
                <h4>5.1 Ongoing Revision</h4>
                <p>Reserve the last 15-30 minutes of daily study for quick revision of previously learned materials.</p>
                <h4>5.2 Final Month Revision</h4>
                <p>Dedicate most of your study time to revision. Go over mistake logs, short notes, and weak topics.</p>
            </div>
        )
    },
    {
        title: "6. Motivation & Discipline",
        content: (
            <div className="prose dark:prose-invert max-w-none">
                <h4>6.1 Staying Consistent</h4>
                <p>Set short-term targets and reward yourself for meeting them.</p>
                <h4>6.2 Managing Stress</h4>
                <p>Practice stress management, get 6-7 hours of sleep, and take meaningful breaks to avoid burnout.</p>
            </div>
        )
    },
    {
        title: "7. Special Preparation for Government Exams",
        content: (
            <div className="prose dark:prose-invert max-w-none">
                <h4>7.1 Understanding Subject Weightage</h4>
                <p>Analyze previous papers to find frequently asked topics. Cover General Knowledge and Current Affairs if applicable.</p>
                <h4>7.2 Staying Updated</h4>
                <p>Read newspapers or follow reliable online news sources daily for current affairs.</p>
            </div>
        )
    },
    {
        title: "8. FAQs and Tips",
        content: (
            <div className="prose dark:prose-invert max-w-none">
                <p><strong>Is daily study more effective than weekend marathons?</strong><br/>Yes—consistency and daily engagement yield better retention and less stress.</p>
                <p><strong>Are coaching classes necessary?</strong><br/>Not mandatory. Self-study with the right resources is sufficient, but coaching can help with doubt clearing.</p>
            </div>
        )
    },
    {
      title: "9. Key Takeaways",
      content: (
          <ul className="space-y-2 prose dark:prose-invert max-w-none">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/><span>Begin early with a clear, structured roadmap.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/><span>Revise systematically and use active recall methods.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/><span>Simulate exam conditions with frequent mock tests.</span></li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/><span>Prioritize health and well-being throughout the journey.</span></li>
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
    },
  },
};

export default function RoadmapPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <h1 className="text-4xl font-bold font-headline text-primary">Your Comprehensive Study Guide</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              A detailed guide for ECET and diploma-based government exams, covering everything from planning to final revision.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
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
                    {guideSections.map((section, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline">{section.title}</AccordionTrigger>
                            <AccordionContent>
                                {section.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
          </motion.div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
