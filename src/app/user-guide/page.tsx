
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowRight, Lightbulb, CheckCircle, Smartphone, Tablet, Laptop, HelpCircle, FileSignature, BarChart, Bot } from "lucide-react";
import Image from "next/image";

const guideSteps = [
    {
        icon: FileSignature,
        title: "1. Select Your Exam & Branch",
        description: "Begin by choosing your specific engineering branch or government exam from our comprehensive list. This tailors the entire platform experience to your needs.",
        image: "https://placehold.co/600x400.png",
        imageHint: "course selection screen"
    },
    {
        icon: BarChart,
        title: "2. Take Realistic Mock Tests",
        description: "Simulate the real exam environment with our timed mock tests. Familiarize yourself with the question palette, timer, and navigation to build confidence and improve time management.",
        image: "https://placehold.co/600x400.png",
        imageHint: "exam interface"
    },
    {
        icon: Bot,
        title: "3. Get Instant AI-Powered Feedback",
        description: "Upon submission, you get more than just a score. Our AI analyzes your performance, identifies your weak topics, and provides actionable feedback to guide your study plan.",
        image: "https://placehold.co/600x400.png",
        imageHint: "analytics dashboard"
    },
    {
        icon: HelpCircle,
        title: "4. Use the 24/7 AI Doubt Solver",
        description: "Stuck on a concept? Our AI tutor is available around the clock. Ask any question, from simple definitions to complex problems, and get clear, step-by-step explanations.",
        image: "https://placehold.co/600x400.png",
        imageHint: "ai chat interface"
    }
];

const faqs = [
    {
        question: "Can I reset my progress and start over?",
        answer: "Currently, progress reset is not available automatically. However, you can retake exams, and your dashboard will reflect your updated average scores and performance history."
    },
    {
        question: "How do I switch to a different branch or exam category?",
        answer: "Simply navigate back to the 'Exams' page from the main menu. You can select a different ECET branch or switch to the Government Exams tab at any time."
    },
    {
        question: "Can I use this platform for government exams too?",
        answer: "Yes! We have a dedicated section for popular diploma-based government exams. You can access curated mock tests and syllabus information under the 'Government Exams' tab on the Exams page."
    }
];

export default function UserGuidePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <div 
            className="text-center py-16 md:py-24 px-4 bg-primary/5"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
            🚀 Get the Most Out of Your Prep Journey
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
            Your complete walkthrough on how to navigate, learn, and succeed using our platform's powerful features.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto"><PlayCircle className="mr-2 h-5 w-5" /> Watch Quick Demo</Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">Start Learning Now <ArrowRight className="ml-2 h-5 w-5" /></Button>
          </div>
        </div>
        
        {/* Walkthrough Section */}
        <div className="py-16 md:py-24 px-4 container mx-auto">
             <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start"
            >
                {guideSteps.map((step, index) => (
                    <div key={step.title}>
                        <Card className="shadow-lg hover:shadow-primary/20 transition-shadow duration-300 border-none overflow-hidden">
                            <CardContent className="p-0">
                               <Image src={step.image} alt={step.title} data-ai-hint={step.imageHint} width={600} height={400} className="w-full h-56 object-cover" />
                               <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-accent/10 text-accent rounded-full">
                                            <step.icon className="h-6 w-6"/>
                                        </div>
                                        <h3 className="text-xl font-bold font-headline text-primary">{step.title}</h3>
                                    </div>
                                    <p className="text-muted-foreground">{step.description}</p>
                                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-secondary/10">
                                       <Lightbulb className="h-5 w-5 text-secondary shrink-0" />
                                       <p className="text-sm text-secondary-foreground font-medium">
                                            Pro Tip: Use the search bar on the exams page to find your course instantly.
                                       </p>
                                    </div>
                               </div>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </div>
        </div>

        {/* FAQs and Compatibility Section */}
        <div className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                    <div>
                        <h2 className="text-3xl font-bold text-primary font-headline mb-6">Frequently Asked Questions</h2>
                        <Accordion type="single" collapsible className="w-full bg-card p-4 rounded-lg shadow-md">
                        {faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </div>
                </div>
                <div className="lg:col-span-2">
                     <div>
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="font-headline text-primary">Fully Responsive</CardTitle>
                                <CardDescription>Our platform works seamlessly across all your devices.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-around items-center text-muted-foreground">
                                <div className="flex flex-col items-center gap-2">
                                    <Smartphone className="h-8 w-8" />
                                    <span>Mobile</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Tablet className="h-8 w-8" />
                                    <span>Tablet</span>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Laptop className="h-8 w-8" />
                                    <span>Desktop</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>

      </main>
      <AppFooter />
    </div>
  );
}
