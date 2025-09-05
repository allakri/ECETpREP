
"use client";

import { BrainCircuit, BookCheck, MessageSquareHeart } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { motion } from "framer-motion";

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

export function Features() {
  return (
    <div className="bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-base font-semibold leading-7 text-accent">Your Path to Success</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Everything you need to ace your exams
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform is packed with features designed to give you the ultimate advantage in your exam preparation.
          </p>
        </motion.div>
        <div
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center flex flex-col items-center hover:shadow-lg hover:-translate-y-1 transition-all">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4 mx-auto">
                      <feature.icon className="h-7 w-7 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold leading-7 text-foreground font-headline">
                      {feature.name}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-base leading-7 text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild variant="link" className="mt-4">
                      <Link href="/about">Learn More →</Link>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}
