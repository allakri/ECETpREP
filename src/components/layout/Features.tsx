
"use client";

import { BrainCircuit, BookCheck, MessageSquareHeart } from "lucide-react";
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

export function Features() {
  return (
    <div className="bg-card py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div 
          className="mx-auto max-w-2xl lg:text-center"
        >
          <h2 className="text-base font-semibold leading-7 text-accent">Your Path to Success</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
            Everything you need to ace your exams
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our platform is packed with features designed to give you the ultimate advantage in your exam preparation.
          </p>
        </div>
        <dl 
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-8"
        >
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col items-center text-center p-6 rounded-lg border border-transparent hover:border-primary/20 hover:shadow-lg transition-all">
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
              </div>
            ))}
        </dl>
      </div>
    </div>
  )
}
