
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { courses } from "@/lib/courses";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function CoursesPage() {
  return (
    <AppShell>
        <div className="flex-grow bg-background">
            <Breadcrumbs className="pt-8" />
            {/* Hero Section */}
            <div 
            className="text-center py-16 md:py-24 px-4 bg-primary/5"
            >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
                Explore ECET & Govt. Exam Courses
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Choose your branch, access structured learning paths, and prepare with confidence using our expert-curated content.
            </p>
            </div>

            {/* Courses Grid */}
            <div className="py-16 md:py-24 px-4 container mx-auto">
                <div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {courses.map((course) => {
                    const Icon = course.icon;
                    return (
                        <div key={course.slug}>
                        <Card className="h-full flex flex-col shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
                            <CardHeader className="flex-row items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Icon className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="font-headline text-xl text-primary">{course.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{course.description}</p>
                            </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                                {course.tags.map(tag => <li key={tag}>{tag}</li>)}
                            </ul>
                            </CardContent>
                            <div className="p-6 pt-0">
                            <Button asChild className="w-full">
                                <Link href={`/courses/${course.slug}`}>
                                View Details <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            </div>
                        </Card>
                        </div>
                    )
                    })}
                </div>
            </div>
        </div>
    </AppShell>
  );
}
