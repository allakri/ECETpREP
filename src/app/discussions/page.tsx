
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const discussions = [
  {
    id: 1,
    title: "Struggling with Kirchhoff's Voltage Law (KVL)",
    author: "Anjali Gupta",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "woman smiling",
    replies: 5,
    lastReply: "3 hours ago",
    topic: "Electrical Circuits",
  },
  {
    id: 2,
    title: "Can someone explain the concept of pointers in C?",
    author: "Rahul Verma",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "man portrait",
    replies: 12,
    lastReply: "1 day ago",
    topic: "Programming",
  },
  {
    id: 3,
    title: "Best resources for preparing for the Mathematics section?",
    author: "Priya Sharma",
    avatar: "https://placehold.co/100x100.png",
    avatarHint: "woman portrait",
    replies: 8,
    lastReply: "2 days ago",
    topic: "General",
  },
];

export default function DiscussionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-lg">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-headline text-primary">Community Discussions</CardTitle>
                <CardDescription>Ask questions, share knowledge, and learn with your peers.</CardDescription>
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusCircle className="mr-2 h-5 w-5" />
                Start a New Discussion
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:bg-muted/50 transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={discussion.avatar} alt={discussion.author} data-ai-hint={discussion.avatarHint} />
                            <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg text-primary cursor-pointer hover:underline">{discussion.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Started by {discussion.author} in{" "}
                              <span className="font-medium text-accent-foreground">{discussion.topic}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground text-right">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>{discussion.replies}</span>
                          </div>
                          <div className="ml-4 w-24">
                            <p>{discussion.lastReply}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
