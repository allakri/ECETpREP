
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, XCircle } from "lucide-react";
import { courses } from "@/lib/courses";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/layout/AppShell";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
      ease: "easeOut",
    },
  },
};

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter(course => {
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query) ||
      course.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <AppShell>
        <div className="flex-grow bg-background">
            <Breadcrumbs className="pt-8" />
            {/* Hero Section */}
            <motion.div 
            className="text-center py-16 md:py-24 px-4 bg-primary/5"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary font-headline">
                Explore ECET & Govt. Exam Courses
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Choose your branch, access structured learning paths, and prepare with confidence using our expert-curated content.
            </p>
            <div className="mt-8 max-w-lg mx-auto">
                <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search for a course or branch..." 
                    className="pl-10 h-12 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
            </div>
            </motion.div>

            {/* Courses Grid */}
            <div className="py-16 md:py-24 px-4 container mx-auto">
            {filteredCourses.length > 0 ? (
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={containerVariants}
                >
                    {filteredCourses.map((course) => {
                    const Icon = course.icon;
                    return (
                        <motion.div key={course.slug} variants={itemVariants}>
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
                        </motion.div>
                    )
                    })}
                </motion.div>
            ) : (
                <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <XCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-semibold text-xl">No Courses Found</p>
                    <p className="text-muted-foreground">Your search for "{searchQuery}" did not match any courses.</p>
                </div>
            )}
            </div>
        </div>
    </AppShell>
  );
}
