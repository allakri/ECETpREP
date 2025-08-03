"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { courses } from '@/lib/courses';
import { exams } from '@/lib/exams';
import * as React from 'react';

// Helper function to capitalize words
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper to format slugs into readable text
const formatSegment = (segment: string) => {
    return segment.split('-').map(capitalize).join(' ');
}

export function Breadcrumbs({ className }: { className?: string }) {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(Boolean);

    // Don't show breadcrumbs on the homepage
    if (pathname === '/') {
        return null;
    }

    const breadcrumbItems = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;
        
        let text = formatSegment(segment);
        
        // Special handling for dynamic routes like /courses/[slug] or /exams/[slug]
        if (isLast) {
            if (segments[index-1] === 'courses') {
                const course = courses.find(c => c.slug === segment);
                if(course) text = course.title;
            } else if (segments[index-1] === 'exams') {
                const exam = exams.find(e => e.slug === segment);
                if(exam) text = exam.name;
            }
        }

        return (
            <React.Fragment key={href}>
                <ChevronRight className="h-4 w-4" />
                <li>
                    {isLast ? (
                        <span className="font-medium text-foreground">{text}</span>
                    ) : (
                        <Link href={href} className="hover:text-primary transition-colors">
                            {text}
                        </Link>
                    )}
                </li>
            </React.Fragment>
        );
    });

    return (
        <nav className={cn("container mx-auto px-4 mb-8", className)}>
            <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
                <li>
                    <Link href="/" className="hover:text-primary transition-colors">
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>
                {breadcrumbItems}
            </ol>
        </nav>
    );
}