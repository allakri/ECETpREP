
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const stories = [
    {
        name: "Priya Sharma",
        branch: "Computer Science & Engineering",
        quote: "The AI feedback was a game-changer. It showed me exactly where I was weak and helped me focus my study time. I went from being unsure if I'd pass to securing a top-500 rank!",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "woman smiling",
        college: "Secured Admission in JNTU, Kakinada"
    },
    {
        name: "Rahul Verma",
        branch: "Mechanical Engineering",
        quote: "I struggled with time management. Taking the timed mock tests on this platform was the best practice I could have asked for. I finished my actual ECET with 15 minutes to spare. Unbelievable!",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "man portrait",
        college: "Secured Admission in AU College of Engineering"
    },
    {
        name: "Anjali Gupta",
        branch: "Electronics & Communication",
        quote: "The 24/7 AI Doubt Solver is like having a personal tutor. No matter how small my question, I got an instant, clear explanation. It was crucial for clearing my concepts in circuit theory.",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "woman portrait",
        college: "Secured Admission in SV University, Tirupati"
    },
    {
        name: "Suresh Kumar",
        branch: "Civil Engineering",
        quote: "As a diploma student, I wasn't sure how to prepare. The structured roadmap and subject-wise tests gave me a clear path. Thank you for building this platform!",
        avatar: "https://placehold.co/100x100.png",
        avatarHint: "man engineer",
        college: "Secured Admission in G. Pulla Reddy Engineering College"
    }
];

export default function SuccessStoriesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/20 py-12 md:py-20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline text-primary">Success Stories</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Real stories from students who transformed their preparation and achieved their dreams with our platform.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {stories.map((story) => (
                    <Card key={story.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 border-2 border-primary/50">
                                    <AvatarImage src={story.avatar} alt={story.name} data-ai-hint={story.avatarHint} />
                                    <AvatarFallback>{story.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold text-primary">{story.name}</h3>
                                    <p className="text-muted-foreground">{story.branch}</p>
                                </div>
                            </div>
                            <blockquote className="mt-4 border-l-4 border-accent pl-4 text-lg italic text-foreground">
                                "{story.quote}"
                            </blockquote>
                            <div className="mt-4 flex items-center gap-2 text-amber-500">
                                <Star className="h-5 w-5 fill-current" />
                                <p className="font-semibold text-muted-foreground">{story.college}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
