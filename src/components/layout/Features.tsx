
"use client";

import { BrainCircuit, BookCheck, Timer } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: 'AI-Powered Feedback',
    description: 'Our AI analyzes your test performance to identify your weakest subjects and provides actionable advice, helping you study smarter, not harder.',
    icon: BrainCircuit,
  },
  {
    name: 'Comprehensive Mock Tests',
    description: 'Access a vast library of mock tests, including previous years\' papers and custom tests tailored to your specific branch and subjects.',
    icon: BookCheck,
  },
  {
    name: 'Realistic Exam Simulation',
    description: 'Practice in a real exam environment with a countdown timer and a question palette for easy navigation, just like the actual ECET.',
    icon: Timer,
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
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
            {features.map((feature) => (
              <motion.div key={feature.name} className="relative pl-16" variants={itemVariants}>
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">{feature.description}</dd>
              </motion.div>
            ))}
        </motion.dl>
      </div>
    </div>
  )
}
