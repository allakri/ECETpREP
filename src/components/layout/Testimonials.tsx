
"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
];

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

export function Testimonials() {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={itemVariants}
        >
            <h2 className="text-3xl font-extrabold font-headline text-foreground tracking-tight">
                Trusted by Students Like You
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Don't just take our word for it. Here's what some of our students have to say about their experience.
            </p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="flex flex-col justify-between shadow-lg bg-background h-full">
                <CardContent className="pt-6">
                  <blockquote className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </blockquote>
                </CardContent>
                <div className="mt-4 flex items-center gap-4 p-6 pt-0">
                  <Image
                    className="h-12 w-12 rounded-full"
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
