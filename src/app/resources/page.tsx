
"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpenCheck, BookCopy, Users, User, Compass } from "lucide-react";

// Components that were previously separate pages are now imported to be used as tab content.
// Note: For simplicity, I'm defining these components here. In a larger refactor, they would be moved to their own files.

// Roadmap Content Component (from former roadmap/page.tsx)
import RoadmapContent from '@/components/resources/RoadmapContent';
// Courses Content Component (from former courses/page.tsx)
import CoursesContent from '@/components/resources/CoursesContent';
// Discussions Content Component (from former discussions/page.tsx)
import DiscussionsContent from '@/components/resources/DiscussionsContent';
// UserGuide Content Component (from former user-guide/page.tsx)
import UserGuideContent from '@/components/resources/UserGuideContent';


export default function ResourcesPage() {
  return (
    <AppShell>
      <div className="flex-grow bg-background">
        <div className="bg-primary/5 py-12">
            <Breadcrumbs className="pt-0 container mx-auto" />
             <div className="container mx-auto px-4 mt-8 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
                    Student Resources Hub
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                    Your one-stop center for study roadmaps, course selection, community discussions, and platform guides.
                </p>
            </div>
        </div>

        <div className="py-12 px-4 container mx-auto">
           <Tabs defaultValue="roadmap" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto md:h-14">
                  <TabsTrigger value="roadmap" className="text-base font-headline h-full py-3 md:py-0"><Compass className="mr-2"/> Roadmap</TabsTrigger>
                  <TabsTrigger value="courses" className="text-base font-headline h-full py-3 md:py-0"><BookCopy className="mr-2"/> Courses</TabsTrigger>
                  <TabsTrigger value="discussions" className="text-base font-headline h-full py-3 md:py-0"><Users className="mr-2"/> Discussions</TabsTrigger>
                  <TabsTrigger value="guide" className="text-base font-headline h-full py-3 md:py-0"><User className="mr-2"/> User Guide</TabsTrigger>
              </TabsList>
              <TabsContent value="roadmap" className="mt-6">
                <RoadmapContent />
              </TabsContent>
              <TabsContent value="courses" className="mt-6">
                <CoursesContent />
              </TabsContent>
              <TabsContent value="discussions" className="mt-6">
                <DiscussionsContent />
              </TabsContent>
              <TabsContent value="guide" className="mt-6">
                <UserGuideContent />
              </TabsContent>
          </Tabs>
        </div>

      </div>
    </AppShell>
  );
}

