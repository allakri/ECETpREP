
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Cpu, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const corePrinciples = [
    {
        icon: Target,
        title: "Personalized Learning",
        description: "We believe in a tailored educational journey. Our AI-driven feedback and adaptive tests focus on your individual strengths and weaknesses, ensuring your study time is always effective."
    },
    {
        icon: Cpu,
        title: "Cutting-Edge Technology",
        description: "Leveraging the best of modern web and AI technology, we provide a seamless, fast, and intelligent platform that keeps you focused and ahead of the curve."
    },
    {
        icon: Users,
        title: "Supportive Community",
        description: "Learning is a collaborative effort. We foster a supportive environment where students can connect, share knowledge, and grow together."
    }
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-lg bg-card border-border">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl lg:text-4xl font-headline text-primary">Our Mission: Your Success</CardTitle>
              <CardDescription className="text-lg">We are here to democratize high-quality exam preparation for every student.</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-4">
              <p>
                Welcome to the Diploma Prep Hub. We aren't just another mock test website; we are a dedicated team of educators and technologists on a mission to revolutionize how students prepare for their entrance and government exams.
              </p>
              <p>
                Our journey began with a simple, powerful idea: every student deserves access to the best tools to achieve their dreams. We saw a need for a smarter, more personalized, and more supportive way to prepare for the most important exams in a student's life. Driven by this passion, we created a comprehensive ecosystem designed to guide you from foundational learning to exam day excellence.
              </p>
            </CardContent>
          </Card>

           <div className="max-w-4xl mx-auto mt-12">
            <Card className="shadow-lg bg-card border-border">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-headline text-primary">A Word From Our Founder</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="Rai Abhishek" data-ai-hint="man portrait"/>
                        <AvatarFallback>RA</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-lg text-foreground italic">
                            "Seeing the gap between traditional learning and the demands of competitive exams, I wanted to build a bridge with technology. The Diploma Prep Hub is that bridge—a platform built to empower every student with the tools and confidence they need to not just compete, but to excel."
                        </p>
                        <p className="font-bold text-primary mt-4">— Rai Abhishek, Founder of Diploma Prep Hub</p>
                    </div>
                </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-center mb-8 font-headline text-primary">Our Core Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {corePrinciples.map((principle) => {
                const Icon = principle.icon;
                return (
                    <div key={principle.title} className="flex flex-col items-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                            <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                        <p className="text-muted-foreground">{principle.description}</p>
                    </div>
                )
              })}
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto mt-20">
             <Card className="max-w-2xl mx-auto shadow-lg bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-3xl font-headline text-primary">Get in Touch</CardTitle>
                  <CardDescription>Have a question or feedback? Fill out the form below to contact us.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="student@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is your message about?" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message here..." rows={5} />
                    </div>
                    <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
          </div>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}
