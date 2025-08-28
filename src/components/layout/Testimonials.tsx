
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    quote: "The AI feedback was a game-changer. It pinpointed exactly where I was going wrong and helped me focus my study time. I improved my score by 25% in just two weeks!",
    name: "Priya Sharma",
    title: "CSE Aspirant",
    image: "https://placehold.co/100x100.png",
    imageHint: "woman portrait",
  },
  {
    quote: "I used to struggle with time management during exams. The timed mock tests on this platform prepared me for the real thing. I finished my actual ECET with time to spare.",
    name: "Rahul Verma",
    title: "Mechanical Eng. Student",
    image: "https://placehold.co/100x100.png",
    imageHint: "man portrait",
  },
  {
    quote: "Being able to create custom tests based on specific subjects was incredibly helpful. It allowed me to strengthen my weakest topics right before the exam.",
    name: "Anjali Gupta",
    title: "ECE Aspirant",
    image: "https://placehold.co/100x100.png",
    imageHint: "woman smiling",
  },
  {
    quote: "The 24/7 AI Doubt Solver is brilliant. I could get my questions answered instantly, even late at night. It's like having a personal tutor.",
    name: "Suresh Kumar",
    title: "Civil Eng. Aspirant",
    image: "https://placehold.co/100x100.png",
    imageHint: "man engineer",
  }
];

export function Testimonials() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div 
            className="text-center mb-12"
        >
            <h2 className="text-3xl font-extrabold font-headline text-foreground tracking-tight">
                Trusted by Students Like You
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Don't just take our word for it. Here's what some of our students have to say about their experience.
            </p>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="flex flex-col justify-between shadow-lg bg-background min-h-[280px]">
                    <CardContent className="pt-6">
                      <blockquote className="text-muted-foreground italic text-lg">
                        "{testimonial.quote}"
                      </blockquote>
                    </CardContent>
                    <div className="mt-4 flex items-center gap-4 p-6 pt-0">
                      <Image
                        className="h-12 w-12 rounded-full object-cover"
                        src={testimonial.image}
                        data-ai-hint={testimonial.imageHint}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                      />
                      <div>
                        <p className="font-semibold text-primary">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
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
      </div>
    </section>
  );
}
