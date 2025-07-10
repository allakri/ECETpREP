
"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function Hero() {
  const scrollToExams = () => {
    document.getElementById("exam-selection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="text-center py-16 md:py-24 px-4 bg-background">
      <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight">
        Unlock Your Engineering Future
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
        Your ultimate platform for ECET preparation. Master key concepts with our mock tests, get instant AI-powered feedback, and clear your doubts 24/7.
      </p>
      <div className="mt-8">
        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg font-bold" onClick={scrollToExams}>
          Get Started <ArrowDown className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
