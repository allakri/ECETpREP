
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, Rocket, Flag, Target, University } from "lucide-react";
import { motion } from "framer-motion";

const roadmapPhases = [
    {
        icon: Rocket,
        title: "Phase 1: Foundation Building (First 30 Days)",
        description: "Focus on understanding the fundamental concepts. Don't worry about speed yet; focus on accuracy.",
        keyPoints: [
            "Thoroughly review the ECET syllabus for your branch.",
            "Gather essential study materials: textbooks, notes, and our platform.",
            "Create a realistic study schedule, allocating time for each subject.",
            "Master the basic formulas and theories of core subjects like Mathematics, Physics, and Chemistry."
        ]
    },
    {
        icon: Flag,
        title: "Phase 2: Deep Dive & Practice (Next 60 Days)",
        description: "Strengthen your understanding by solving a wide variety of problems and taking topic-wise tests.",
        keyPoints: [
            "Solve practice problems from standard textbooks.",
            "Take custom mock tests on our platform, focusing on individual subjects.",
            "Analyze your performance after each test using our AI feedback.",
            "Use the 'AI Doubt Solver' to clarify complex concepts immediately."
        ]
    },
    {
        icon: Target,
        title: "Phase 3: Revision & Mock Tests (Last 30 Days)",
        description: "Simulate the real exam environment to improve speed, accuracy, and time management.",
        keyPoints: [
            "Take full-length mock tests based on previous years' papers.",
            "Work on your time management. Aim to finish the exam with 15 minutes to spare for review.",
            "Revise your notes, especially for marked questions and weak topics identified by the AI.",
            "Stay calm and confident. Consistent practice is the key to success."
        ]
    }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

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
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={itemVariants}
          >
            <h1 className="text-4xl font-bold font-headline text-primary">Your Roadmap to Success</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              A step-by-step guide to help you prepare effectively for the ECET and secure admission into a top engineering college.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {roadmapPhases.map((phase, index) => (
                <motion.div key={index} variants={itemVariants}>
                    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                               <phase.icon className="h-6 w-6 text-primary"/>
                            </div>
                            <div>
                                <CardTitle className="text-xl font-headline">{phase.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">{phase.description}</p>
                            <ul className="space-y-2">
                               {phase.keyPoints.map((point, pIndex) => (
                                   <li key={pIndex} className="flex items-start gap-2">
                                       <CheckCircle2 className="h-5 w-5 text-accent mt-1 shrink-0"/>
                                       <span>{point}</span>
                                   </li>
                               ))}
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
          >
            <Card className="max-w-4xl mx-auto shadow-lg bg-card border-border">
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="p-3 bg-accent/10 rounded-lg">
                        <University className="h-6 w-6 text-accent"/>
                     </div>
                    <CardTitle className="text-2xl font-headline text-primary">How to Choose the Right College</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>What factors should I consider when choosing a college?</AccordionTrigger>
                      <AccordionContent>
                        Consider factors like the college's NIRF ranking, faculty experience, campus placement records (especially for your branch), infrastructure, location, and alumni network.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>How important is the branch vs. the college?</AccordionTrigger>
                      <AccordionContent>
                        This is a classic dilemma. A good branch in a decent college is often better than a less preferred branch in a top college. Your branch will define your core engineering career. However, a top-tier college offers a better brand name, peer group, and overall opportunities. Aim for the best combination possible.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Where can I find reliable information about colleges?</AccordionTrigger>
                      <AccordionContent>
                        Check official sources like the All India Council for Technical Education (AICTE) and the National Board of Accreditation (NBA) websites. College websites, admission brochures, and speaking to current students or alumni are also great sources.
                      </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-4">
                      <AccordionTrigger>What role does my ECET rank play?</AccordionTrigger>
                      <AccordionContent>
                        Your ECET rank is the most critical factor. It directly determines which colleges and branches you are eligible for during the counseling process. A better rank gives you more and better choices. Use our platform to aim for the highest rank possible!
                      </AccordionContent>
                    </AccordionItem>
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
