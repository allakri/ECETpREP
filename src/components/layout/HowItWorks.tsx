
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Bot, FileText, UserPlus } from "lucide-react";
import { motion } from "framer-motion";


const steps = [
  {
    icon: UserPlus,
    title: "1. Register",
    description: "Create your account in seconds to get a personalized dashboard.",
  },
  {
    icon: FileText,
    title: "2. Pick Exam",
    description: "Choose from a wide range of mock tests for your branch.",
  },
  {
    icon: Bot,
    title: "3. Get Feedback",
    description: "Receive instant, AI-powered analysis of your performance.",
  },
  {
    icon: Award,
    title: "4. Succeed",
    description: "Use the insights to focus your studies and achieve your goal.",
  },
];

export function HowItWorks() {
    return (
        <div id="how-it-works" className="bg-secondary/20 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-extrabold font-headline text-primary tracking-tight">
                        A Clear Path to Success
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Our platform is designed to be simple and effective. Here’s how you can get started on your journey to acing your exams.
                    </p>
                </motion.div>
                <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {steps.map((step, index) => (
                         <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="text-center border-border shadow-lg bg-card h-full hover:shadow-primary/20 transition-shadow">
                                <CardHeader>
                                    <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                                        <step.icon className="h-8 w-8 text-accent" />
                                    </div>
                                    <CardTitle className="font-headline text-xl text-primary">{step.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground">
                                    {step.description}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
