
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";


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

const DiscussionsPageSkeleton = () => (
  <div className="flex flex-col min-h-screen bg-background">
    <AppHeader />
    <main className="flex-grow bg-background py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto shadow-lg bg-card">
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <Skeleton className="h-9 w-72 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-52" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-background">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-6 w-80" />
                          <Skeleton className="h-4 w-60" />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-24" />
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

export default function DiscussionsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DiscussionsPageSkeleton />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-background py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto shadow-lg bg-card">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-headline text-primary">Community Discussions</CardTitle>
                <CardDescription>Ask questions, share knowledge, and learn with your peers.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Start a New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-primary text-2xl">Start a New Discussion</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input id="title" placeholder="Enter a descriptive title for your question" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="message" className="text-right pt-2">
                                Message
                            </Label>
                            <Textarea id="message" placeholder="Type your message here. Be clear and concise." className="col-span-3" rows={8}/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Post Discussion</Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:bg-muted/50 transition-colors bg-background">
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
                              Started by {discussion.author}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground text-right gap-4">
                          <Badge variant="outline">{discussion.topic}</Badge>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>{discussion.replies}</span>
                          </div>
                          <div className="w-24">
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
