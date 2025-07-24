
"use client";

import { BrainCircuit, BookCheck, MessageSquareHeart } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";

const features = [
  {
    name: 'AI-Powered Feedback',
    description: 'Get instant, personalized feedback that pinpoints your weak areas and guides your study plan. No more guesswork.',
    icon: BrainCircuit,
  },
  {
    name: 'Realistic Mock Tests',
    description: 'Practice with a vast library of mock tests, including previous years\' papers, in a timed, real-exam environment.',
    icon: BookCheck,
  },
  {
    name: '24/7 AI Doubt Solver',
    description: 'Stuck on a concept at 2 AM? Our AI tutor is always available to provide clear, step-by-step explanations.',
    icon: MessageSquareHeart,
  },
]

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


export function Features() {
  return (
    <div className="bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={itemVariants}
        >
          <h2 className="text-base font-semibold leading-7 text-accent">Your Path to Success</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Everything you need to ace the ECET
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform is packed with features designed to give you the ultimate advantage in your exam preparation.
          </p>
        </motion.div>
        <motion.dl 
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
            {features.map((feature) => (
              <motion.div key={feature.name} className="flex flex-col items-center text-center p-6 rounded-lg border border-transparent hover:border-primary/20 hover:shadow-lg transition-all" variants={itemVariants}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4">
                  <feature.icon className="h-7 w-7 text-primary-foreground" aria-hidden="true" />
                </div>
                <dt className="text-xl font-semibold leading-7 text-foreground font-headline">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
                <Button asChild variant="link" className="mt-4">
                  <Link href="/about">Learn More →</Link>
                </Button>
              </motion.div>
            ))}
        </motion.dl>
      </div>
    </div>
  )
}
