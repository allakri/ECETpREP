
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Cpu, Users, Linkedin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";


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
];

const teamMembers = [
    {
        name: "Rai Abhishek",
        linkedin: "https://www.linkedin.com/in/abhishek-rai--/",
        avatar: "/images/team/abhishek.png",
        avatarHint: "man portrait smiling",
    },
    {
        name: "M. Shashi Vardhan reddy",
        linkedin: "https://www.linkedin.com/in/shashi-vardhan-reddy-mandumula/",
        avatar: "/images/team/shashi.png",
        avatarHint: "man software developer",
    },
    {
        name: "N. Revanth",
        linkedin: "https://www.linkedin.com/in/revanth-nagidi-746086275/",
        avatar: "/images/team/revanth.png",
        avatarHint: "man designer",
    },
    {
        name: "Sneha Goshika",
        linkedin: "https://www.linkedin.com/in/sneha-goshika-08ba2428b/",
        avatar: "/images/team/sneha.png",
        avatarHint: "woman engineer",
    }
];

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

          <div className="max-w-5xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline text-primary">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member) => (
                    <Link key={member.name} href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <Card className="text-center shadow-lg hover:shadow-primary/20 transition-shadow duration-300 h-full group">
                            <CardContent className="pt-6 flex flex-col items-center">
                                <Avatar className="h-24 w-24 mb-4 border-4 border-primary/20">
                                    <Image src={member.avatar} alt={member.name} width={100} height={100} className="object-cover" />
                                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                                    <Linkedin className="h-4 w-4" />
                                    <span>LinkedIn Profile</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
          </div>

        </div>
      </main>
      <AppFooter />
    </div>
  );
}
