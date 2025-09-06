"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();

  return (
     <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')"}}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#111714] via-[#111714]/80 to-[#111714]"></div>
        <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter text-white">Unlock Your Engineering Future</h1>
                <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">From Diploma to Degree, We've Got Your Back. Master key concepts with mock tests, instant AI feedback, and 24/7 doubt solving.</p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center">
                    <Button size="lg" onClick={() => router.push('/exams')} className="rounded-full h-12 px-8 bg-primary text-primary-foreground text-base font-bold hover:bg-primary/90 transition-colors">
                      Get Started
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => router.push('/#how-it-works')} className="rounded-full h-12 px-8 bg-white/10 text-white text-base font-bold hover:bg-white/20 transition-colors items-center gap-2 border-0">
                        <PlayCircle /> Watch Demo
                    </Button>
                </div>
            </div>
            <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                    <h3 className="text-3xl font-bold text-primary">200+</h3>
                    <p className="text-white/80 font-medium">Mock Tests</p>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                    <h3 className="text-3xl font-bold text-primary">AI-Powered</h3>
                    <p className="text-white/80 font-medium">Feedback</p>
                </div>
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                    <h3 className="text-3xl font-bold text-primary">24/7</h3>
                    <p className="text-white/80 font-medium">Doubt Solver</p>
                </div>
            </div>
        </div>
    </section>
  );
}
