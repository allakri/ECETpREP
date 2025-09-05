"use client";

import { Bot, FileText, BrainCircuit, BookCheck, MessageSquareHeart } from "lucide-react";

const features = [
  {
    name: 'Realistic Mock Tests',
    description: 'Simulate the exam experience with our extensive library of mock tests. Analyze your performance and track your progress.',
    icon: FileText,
  },
  {
    name: 'AI-Powered Feedback',
    description: 'Receive instant, personalized feedback on your mock tests. Our AI identifies your weak areas and suggests improvement strategies.',
    icon: BrainCircuit,
  },
  {
    name: '24/7 AI Doubt Solver',
    description: 'Never get stuck on a concept again. Our AI-powered doubt solver is available around the clock to answer your questions instantly.',
    icon: Bot,
  },
]

export function Features() {
  return (
    <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Your Path to Success with Diploma Prep Hub</h2>
                <p className="mt-4 text-lg text-white/60">We provide the tools and support you need to excel in your exam and secure your engineering degree.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                 {features.map((feature) => (
                    <div key={feature.name} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                            <feature.icon className="text-3xl" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xl font-bold text-white">{feature.name}</h3>
                            <p className="text-white/60">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}
