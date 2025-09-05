
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, FileText, Megaphone, Newspaper, PlayCircle, Trophy, Users, Star, BrainCircuit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const testimonials = [
  {
      name: "Sai Kumar",
      branch: "EEE",
      quote: "This platform's mock tests helped me improve my speed and accuracy in just two weeks. The AI feedback is incredibly precise!",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "man smiling"
  },
  {
      name: "Lakshmi Priya",
      branch: "CSE",
      quote: "The 24/7 AI doubt solver was a lifesaver for late-night study sessions. It's like having a personal tutor on demand.",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "woman portrait"
  },
  {
      name: "Abdul Khan",
      branch: "Mechanical",
      quote: "I wasn't sure about my career path after diploma. The government exam section opened up a whole new world of possibilities for me.",
      avatar: "https://placehold.co/100x100.png",
      avatarHint: "man engineer"
  }
]

export default function CommunityHubContent() {
  return (
    <div className="space-y-12">
        <section className="bg-primary/5 text-center py-16 px-4 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary font-headline">
            Join the Learning Revolution 🚀
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Connect with aspirants, get expert tips, and stay updated with the latest from ECET & Government Exam Prep.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                <Link href="https://t.me/diplomaprephub" target="_blank" rel="noopener noreferrer">
                    <Megaphone className="mr-2 h-5 w-5" /> Join our Telegram
                </Link>
            </Button>
          </div>
        </section>
        
        <section>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl font-headline">From Our Students</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Real stories from students who are on their journey to success with us.</p>
            </div>
            <Carousel
                opts={{ align: "start", loop: true, }}
                className="w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto"
            >
                <CarouselContent>
                {testimonials.map((testimonial, index) => (
                    <CarouselItem key={index} className="sm:basis-1/2 lg:basis-1/3">
                        <div className="p-1">
                        <Card className="flex flex-col justify-between shadow-lg bg-card h-[250px]">
                            <CardContent className="pt-6">
                            <blockquote className="text-muted-foreground italic text-lg">
                                "{testimonial.quote}"
                            </blockquote>
                            </CardContent>
                            <div className="mt-4 flex items-center gap-4 p-6 pt-0">
                            <Avatar className="h-12 w-12 border-2 border-primary/50">
                                <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-primary">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.branch}</p>
                            </div>
                            </div>
                        </Card>
                        </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    </div>
  );
}
