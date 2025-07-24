
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Megaphone, Newspaper, PlayCircle, Trophy, Users, Star, BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const popularTopics = [
    {
        title: "🔥 Must-Read ECET Strategy by Topper (Full Study Plan)",
        description: "Learn the secrets that helped a top-ranker ace the exam. Includes day-by-day schedule and resource list.",
        link: "#",
        icon: Star,
        image: "https://placehold.co/600x400.png",
        imageHint: "study plan chart"
    },
    {
        title: "👩‍🎓 Best Diploma Govt Jobs in 2025 – Complete List",
        description: "Explore the top government job opportunities available after your diploma, with eligibility criteria and salary expectations.",
        link: "#",
        icon: Users,
        image: "https://placehold.co/600x400.png",
        imageHint: "government building"
    },
    {
        title: "🤖 AI Tools for Students: Write Notes, Solve Questions & More",
        description: "Discover how AI can supercharge your study habits, from automated note-taking to solving complex problems.",
        link: "#",
        icon: BrainCircuit,
        image: "https://placehold.co/600x400.png",
        imageHint: "robot brain futuristic"
    }
];

const testimonials = [
  {
      name: "Sai Kumar",
      branch: "EEE",
      quote: "This platform's mock tests helped me improve my speed and accuracy in just two weeks. The AI feedback is incredibly precise!",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "man smiling"
  },
  {
      name: "Lakshmi Priya",
      branch: "CSE",
      quote: "The 24/7 AI doubt solver was a lifesaver for late-night study sessions. It's like having a personal tutor on demand.",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "woman portrait"
  },
  {
      name: "Abdul Khan",
      branch: "Mechanical",
      quote: "I wasn't sure about my career path after diploma. The government exam section opened up a whole new world of possibilities for me.",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "man engineer"
  }
]

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
            delayChildren: 0.2,
        },
    },
};


export default function CommunityHubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.section 
          className="bg-primary/5 text-center py-16 md:py-24 px-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary font-headline" variants={itemVariants}>
            Join the Learning Revolution 🚀
          </motion.h1>
          <motion.p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground" variants={itemVariants}>
            Connect with aspirants, get expert tips, and stay updated with the latest from ECET & Government Exam Prep.
          </motion.p>
          <motion.div className="mt-8 flex flex-wrap justify-center gap-4" variants={itemVariants}>
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/chat">
                    <Megaphone className="mr-2 h-5 w-5" /> Start a Conversation
                </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
                <Link href="#">
                    <Newspaper className="mr-2 h-5 w-5" /> Get Weekly Insights
                </Link>
            </Button>
             <Button size="lg" variant="secondary" asChild>
                <Link href="/contact">
                    <Users className="mr-2 h-5 w-5" /> Partner With Us
                </Link>
            </Button>
          </motion.div>
        </motion.section>

        {/* Pinned Announcement Banner */}
        <section className="bg-secondary/10 py-4">
            <div className="container mx-auto">
                <Carousel
                    opts={{ align: "start", loop: true, }}
                    className="w-full"
                >
                    <CarouselContent>
                        <CarouselItem>
                            <div className="text-center font-semibold text-secondary-foreground p-2 rounded-lg bg-secondary">
                                📢 ECET 2025 Notification is OUT! Click here to check eligibility.
                            </div>
                        </CarouselItem>
                         <CarouselItem>
                            <div className="text-center font-semibold text-accent-foreground p-2 rounded-lg bg-accent">
                                🎯 7 Tips to Score 120+ in ECET – Download Now
                            </div>
                        </CarouselItem>
                         <CarouselItem>
                            <div className="text-center font-semibold text-primary-foreground p-2 rounded-lg bg-primary">
                                💡 Did you know? 45% of ECET toppers used our custom mock generator
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
            </div>
        </section>


        {/* Popular Topics Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div 
                className="text-center mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={itemVariants}
            >
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">Popular Topics & Guides</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Hand-picked articles and strategies to boost your preparation.</p>
            </motion.div>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={containerVariants}
            >
              {popularTopics.map((topic) => {
                const Icon = topic.icon
                return (
                <motion.div key={topic.title} variants={itemVariants}>
                    <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                        <Image src={topic.image} alt={topic.title} data-ai-hint={topic.imageHint} width={600} height={400} className="w-full h-48 object-cover"/>
                        <CardHeader className="flex-row gap-4 items-start">
                            <div className="p-2 bg-primary/10 rounded-lg mt-1">
                                <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-headline text-lg text-primary">{topic.title}</CardTitle>
                                <CardDescription className="mt-1">{topic.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <Button variant="link" className="p-0">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </CardContent>
                    </Card>
                </motion.div>
              )})}
            </motion.div>
          </div>
        </section>

        {/* Student Voice Section */}
        <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4">
                 <motion.div 
                    className="text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={itemVariants}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">From Our Students</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Real stories from students who are on their journey to success with us.</p>
                </motion.div>
                <Carousel
                    opts={{ align: "start", loop: true, }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <CarouselContent>
                    {testimonials.map((testimonial, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                            <Card className="flex flex-col justify-between shadow-lg bg-card h-[250px]">
                                <CardContent className="pt-6">
                                <blockquote className="text-muted-foreground italic text-lg">
                                    "{testimonial.quote}"
                                </blockquote>
                                </CardContent>
                                <div className="mt-4 flex items-center gap-4 p-6 pt-0">
                                <Avatar className="h-12 w-12 border-2 border-primary/50">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-primary">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.branch}</p>
                                </div>
                                </div>
                            </Card>
                            </div>
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <div className="text-center mt-8">
                    <Button variant="outline">Submit Your Experience <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
            </div>
        </section>

        {/* Featured Video */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                 <motion.div 
                    className="text-center mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={itemVariants}
                >
                    <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">See How It Works</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Take a quick 2-minute tour of our platform and see how we can help you succeed.</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="max-w-4xl mx-auto shadow-2xl overflow-hidden">
                        <div className="aspect-video relative group">
                            <Image src="https://placehold.co/1280x720.png" alt="Platform demo video" data-ai-hint="dashboard futuristic" layout="fill" objectFit="cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Button variant="secondary" size="lg" className="h-16 w-16 rounded-full p-0">
                                    <PlayCircle className="h-10 w-10" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>

         {/* CTA Footer */}
        <section className="py-16 md:py-24 bg-primary/5">
            <div className="container mx-auto px-4 text-center">
                 <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">Ready to level up your preparation?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Let's go! Take the next step on your journey to success.</p>
                 <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/exams"><Trophy className="mr-2 h-5 w-5"/> Start Mock Test</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="/roadmap"><FileText className="mr-2 h-5 w-5"/> View Study Roadmap</Link>
                    </Button>
                     <Button size="lg" variant="secondary" asChild>
                        <Link href="/chat"><BrainCircuit className="mr-2 h-5 w-5"/> Ask AI Doubts</Link>
                    </Button>
                 </div>
            </div>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
