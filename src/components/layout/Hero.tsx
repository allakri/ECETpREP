
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, BookOpenCheck, BrainCircuit, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Hero() {
  const router = useRouter();

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:items-center lg:px-8 lg:py-40">
        <div 
          className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8"
        >
          <h1 
            className="mt-6 text-4xl font-bold tracking-tight text-primary sm:text-6xl font-headline"
          >
            Unlock Your Engineering Future
          </h1>
           <p 
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            From Diploma to Degree, We’ve Got Your Back. Master key concepts with mock tests, instant AI feedback, and 24/7 doubt solving.
          </p>
          <div 
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all font-bold shadow-lg" onClick={() => router.push('/register')}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="link" size="lg" className="text-foreground hover:text-accent font-bold" onClick={() => router.push('/#how-it-works')}>
              <PlayCircle className="mr-2 h-5 w-5"/> Watch Demo
            </Button>
          </div>
          <div 
            className="mt-12 grid grid-cols-1 gap-x-8 gap-y-4 text-base font-semibold leading-7 text-foreground sm:grid-cols-2 md:flex lg:gap-x-10"
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
          </div>
        </div>
        <div 
          className="relative mx-auto mt-16 w-full max-w-lg sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:flex-1 lg:max-w-xl xl:ml-32"
        >
          <div className="p-2 lg:p-4 bg-gray-900/5 rounded-2xl">
            <Image
              src="/images/hero.png"
              alt="AI-powered diploma prep dashboard showing student progress"
              width={2432}
              height={1442}
              className="w-full h-auto rounded-md shadow-2xl ring-1 ring-gray-900/10"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
