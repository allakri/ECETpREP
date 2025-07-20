
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, BookOpenCheck, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Hero() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/exams");
  };

  return (
    <div className="relative isolate overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl font-headline">
            Unlock Your Engineering Future
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Your ultimate platform for ECET preparation. Master key concepts with our mock tests, get instant AI-powered feedback, and clear your doubts 24/7.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg font-bold" onClick={handleGetStarted}>
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="link" size="lg" className="text-foreground hover:text-accent" onClick={() => router.push('/about')}>
              Learn more <span aria-hidden="true">→</span>
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-foreground sm:grid-cols-3 md:flex lg:gap-x-10">
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
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
              <Image
                src="https://placehold.co/600x600.png"
                alt="ECET Prep Platform Screenshot"
                data-ai-hint="students learning studying"
                width={2432}
                height={1442}
                className="w-full max-w-none rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
