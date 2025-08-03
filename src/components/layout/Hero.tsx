
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, BookOpenCheck, BrainCircuit, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

export function Hero() {
  const router = useRouter();

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:items-center lg:px-8 lg:py-40">
        <motion.div 
          className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="mt-6 text-4xl font-bold tracking-tight text-primary sm:text-6xl font-headline"
            variants={itemVariants}
          >
            Unlock Your Engineering Future
          </motion.h1>
           <motion.p 
            className="mt-6 text-lg leading-8 text-muted-foreground"
            variants={itemVariants}
          >
            From Diploma to Degree, We’ve Got Your Back. Master key concepts with mock tests, instant AI feedback, and 24/7 doubt solving.
          </motion.p>
          <motion.div 
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            variants={itemVariants}
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all font-bold shadow-lg" onClick={() => router.push('/register')}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="link" size="lg" className="text-foreground hover:text-accent font-bold" onClick={() => router.push('/#how-it-works')}>
              <PlayCircle className="mr-2 h-5 w-5"/> Watch Demo
            </Button>
          </motion.div>
          <motion.div 
            className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 text-base font-semibold leading-7 text-foreground sm:grid-cols-2 md:flex lg:gap-x-10"
            variants={itemVariants}
          >
              <div className="flex gap-x-2 items-center">
                <BarChart className="h-5 w-5 text-accent" /> 200+ Mock Tests
              </div>
              <div className="flex gap-x-2 items-center">
                <BrainCircuit className="h-5 w-5 text-accent" /> AI-Powered Feedback
              </div>
              <div className="flex gap-x-2 items-center">
                <BookOpenCheck className="h-5 w-5 text-accent" /> 24/7 Doubt Solver
              </div>
          </motion.div>
        </motion.div>
        <motion.div 
          className="relative mx-auto mt-16 w-full max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-full">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="/images/hero.png"
                alt="AI-powered diploma prep dashboard showing student progress"
                width={600}
                height={400}
                className="w-full h-auto rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
