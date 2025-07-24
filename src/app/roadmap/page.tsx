
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle2, Download, Lightbulb, Target, BookCopy, ShieldQuestion, Medal, Brain, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const guideSections = [
    { 
        id: 'understanding-exam', 
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
        id: 'study-plan', 
        title: "2. Creating a Study Plan", 
        icon: Clock, 
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
        id: 'study-techniques', 
        title: "3. Study Techniques", 
        icon: Brain,
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
        id: 'practice-testing',
        title: "4. Practice and Mock Testing",
        icon: BookCopy,
        content: (
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                <h4>4.1 Solving Previous Year Papers</h4>
                <ul>
                    <li>Attempt at least one full paper under timed conditions every week during the last 3 months.</li>
                    <li>Analyze mistakes, review solutions, and revise weak topics.</li>
                </ul>
                <h4>4.2 Mock Tests</h4>
                <ul>
                    <li>Take sectional mocks for each subject twice a month.</li>
                    <li>In the last two months, switch to full-length mock tests at least once a week.</li>
                </ul>
            </div>
        )
    },
    {
        id: 'faqs',
        title: "5. FAQs and Tips",
        icon: ShieldQuestion,
        content: (
             <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                <ul>
                    <li><strong>Is daily study more effective than weekend marathons?</strong> Yes—consistency and daily engagement yield better retention and less stress.</li>
                    <li><strong>Are coaching classes necessary?</strong> Not mandatory; self-study using the right resources is sufficient, but coaching can help for doubt clearing and structured guidance.</li>
                    <li><strong>How should I handle technical subjects?</strong> Focus on concepts first, then practice application through worked examples and past papers.</li>
                </ul>
            </div>
        )
    },
    { 
        id: 'key-takeaways',
        title: "6. Key Takeaways", 
        icon: Medal,
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
  const [activeSection, setActiveSection] = useState(guideSections[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -70% 0px' }
    );

    guideSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      guideSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);
  
  const handleDownload = (filename: string) => {
    // In a real app, you'd link to a file in /public
    // For this prototype, we'll simulate a download by creating a dummy file.
    const element = document.createElement("a");
    const file = new Blob(["This is a placeholder for your " + filename], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    element.remove();
  }

  const scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background">
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
        </motion.div>
        
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sticky Sidebar */}
                <aside className="lg:w-1/4 lg:sticky top-24 self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Roadmap Sections</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {guideSections.map(section => {
                                    const Icon = section.icon;
                                    return (
                                        <li key={section.id}>
                                            <Button
                                                variant={activeSection === section.id ? 'default' : 'ghost'}
                                                className="w-full justify-start gap-3"
                                                onClick={() => scrollToSection(section.id)}
                                            >
                                                <Icon className={cn("h-5 w-5", activeSection === section.id ? 'text-primary-foreground' : 'text-primary/80')} />
                                                <span className="truncate">{section.title.substring(section.title.indexOf(' ')+1)}</span>
                                            </Button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <div className="lg:w-3/4 space-y-12">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={containerVariants}
                        className="space-y-12"
                    >
                        {guideSections.map((section) => (
                          <motion.div id={section.id} key={section.id} variants={itemVariants}>
                            <Card className="shadow-lg bg-card border-border scroll-mt-24">
                                <CardHeader className="flex flex-row items-center gap-4">
                                     <div className="p-3 bg-accent/10 rounded-lg">
                                        <section.icon className="h-6 w-6 text-accent"/>
                                     </div>
                                    <CardTitle className="text-2xl font-headline text-primary">{section.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {section.content}
                                </CardContent>
                              </Card>
                          </motion.div>
                        ))}
                    </motion.div>
                    
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={itemVariants}
                       >
                         <Card className="bg-secondary/10 border-secondary/20">
                            <CardHeader>
                                <CardTitle className="font-headline text-secondary">Downloadable Resources</CardTitle>
                                <CardDescription>Get these handy resources to supplement your preparation.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <Button variant="outline" onClick={() => handleDownload('study-planner.pdf')}><Download className="mr-2 h-4 w-4" /> Study Planner PDF</Button>
                                <Button variant="outline" onClick={() => handleDownload('formula-mind-maps.pdf')}><Download className="mr-2 h-4 w-4" /> Formula Mind Maps</Button>
                                <Button variant="outline" onClick={() => handleDownload('subject-checklist.pdf')}><Download className="mr-2 h-4 w-4" /> Subject Checklist</Button>
                            </CardContent>
                         </Card>
                      </motion.div>
                </div>
            </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

    