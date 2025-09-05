
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { courses } from "@/lib/courses";
import Link from "next/link";


export default function CoursesContent() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Explore ECET & Govt. Exam Courses</CardTitle>
            <p className="text-muted-foreground">
                Choose your branch, access structured learning paths, and prepare with confidence using our expert-curated content.
            </p>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        </CardContent>
    </Card>
  )
}

