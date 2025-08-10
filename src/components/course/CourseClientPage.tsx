
"use client";

import Link from "next/link";
import { Download, Brain, Clock, ShieldQuestion, BookCopy, BookOpen, ChevronsRight, Award, Trophy, MessageCircleQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Course } from "@/lib/courses";
import { Breadcrumbs } from "../layout/Breadcrumbs";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

interface CourseClientPageProps {
  course: Omit<Course, 'icon'>;
  children: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      ease: "easeOut",
    },
  },
};

const prepTips = [
    { icon: BookOpen, title: "Focus on Fundamentals", description: "Master the core concepts before moving to complex problems." },
    { icon: Trophy, title: "Previous Year Papers", description: "Solve at least 5 years of past papers to understand the pattern." },
    { icon: Clock, title: "Time Management", description: "Practice timed mock tests to improve speed and accuracy." },
    { icon: Award, title: "Consistent Revision", description: "Regularly revise formulas and key concepts to retain information." },
]

export function CourseClientPage({ course, children }: CourseClientPageProps) {
  const router = useRouter();

  const handleAskAIAssistant = () => {
    // Set course context for the chat bot
    const courseContextForAI = {
      title: course.title,
      syllabus: course.syllabus,
    };
    sessionStorage.setItem('courseContext', JSON.stringify(courseContextForAI));
    router.push('/chat');
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary/10">
      <main className="flex-grow bg-background py-12 md:py-16">
        <Breadcrumbs className="mb-0 pt-0" />
        <div className="container mx-auto px-4">
          
          {/* Top Banner */}
          <motion.div 
            className="mt-8"
            initial="hidden" 
            animate="visible" 
            variants={itemVariants}
          >
            <Card className="shadow-lg bg-card border-border">
                <CardHeader className="flex flex-col md:flex-row items-start gap-6">
                    {children}
                    <div>
                        <CardTitle className="text-3xl lg:text-4xl font-headline text-primary">
                            {course.title} – ECET Syllabus & Course Guide
                        </CardTitle>
                        <CardDescription className="text-lg mt-2">
                            Structured roadmap, key topics, and preparation tips for diploma students aiming for ECET.
                        </CardDescription>
                         <div className="mt-4 flex flex-wrap gap-2">
                            {course.tags.map(tag => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </CardHeader>
            </Card>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <motion.div 
              className="lg:col-span-2 space-y-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
              {/* Syllabus Section */}
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3"><BookCopy /> Complete Syllabus</h2>
                <Accordion type="multiple" defaultValue={course.syllabus.map(s => s.subject)} className="w-full space-y-4">
                  {course.syllabus.map((item, index) => (
                    <AccordionItem value={item.subject} key={index} className="border-none">
                      <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="p-0">
                          <AccordionTrigger className="text-lg font-semibold hover:no-underline p-6">
                            {item.subject}
                          </AccordionTrigger>
                        </CardHeader>
                        <AccordionContent>
                          <div className="border-t">
                            <ul className="list-disc list-inside p-6 space-y-2 text-muted-foreground">
                              {item.topics.map((topic, i) => <li key={i}>{topic}</li>)}
                            </ul>
                          </div>
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
              
               {/* Key Prep Tips */}
               <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3"><ShieldQuestion /> Key Preparation Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prepTips.map(tip => {
                    const TipIcon = tip.icon;
                    return (
                      <Card key={tip.title} className="bg-background hover:border-primary transition-colors">
                        <CardContent className="pt-6 flex items-start gap-4">
                          <TipIcon className="h-8 w-8 text-primary mt-1 shrink-0"/>
                          <div>
                            <h4 className="font-semibold">{tip.title}</h4>
                            <p className="text-sm text-muted-foreground">{tip.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </motion.div>
            </motion.div>

            {/* Sidebar Content (now in main flow) */}
            <aside className="lg:sticky top-24 self-start space-y-8">
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <Card className="shadow-lg bg-accent/10 border-accent/20">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-accent"><Brain /> AI Mentor</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">Get a strategic study plan, topic analysis, and expert tips from our AI.</p>
                          <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                            <Link href={`/courses/${course.slug}/ai-mentor`}>
                                Get AI Study Plan
                            </Link>
                          </Button>
                      </CardContent>
                  </Card>
                </motion.div>

                 <motion.div variants={itemVariants}>
                  <Card className="shadow-lg bg-secondary/10 border-secondary/20">
                      <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-secondary"><MessageCircleQuestion/> AI Doubt Corner</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">Stuck on a specific topic? Ask our AI assistant for a quick explanation.</p>
                          <Button onClick={handleAskAIAssistant} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                            Ask AI Assistant
                          </Button>
                      </CardContent>
                  </Card>
                </motion.div>

              </motion.div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
