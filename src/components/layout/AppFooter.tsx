
"use client"

import Link from "next/link";
import { Copyright, Rocket } from "lucide-react";
import { useState, useEffect } from 'react';

const CountUp = ({ end }: { end: number }) => {
    const [count, setCount] = useState(0);
    const duration = 2000;

    useEffect(() => {
        let start = 0;
        const startTimestamp = performance.now();
        
        const step = (timestamp: number) => {
            const progress = timestamp - startTimestamp;
            const percentage = Math.min(progress / duration, 1);
            setCount(Math.floor(percentage * (end - start) + start));
            if (progress < duration) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };

        requestAnimationFrame(step);
    }, [end]);

    return <span>{count.toLocaleString()}</span>;
};


export function AppFooter() {
  const currentYear = new Date().getFullYear();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
      setIsMounted(true);
  }, []);

  return (
    <footer className="bg-card text-card-foreground border-t py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="md:col-span-2">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-4">
                <Rocket className="text-primary"/>
                <h3 className="font-bold text-lg font-headline text-primary">ECET Prep Platform</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto md:mx-0">
              Your comprehensive resource for acing the Engineering Common Entrance Test. Built with modern AI to give you a personalized path to success.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/exams" className="hover:underline text-muted-foreground hover:text-primary">Exams</Link></li>
              <li><Link href="/roadmap" className="hover:underline text-muted-foreground hover:text-primary">Roadmap</Link></li>
              <li><Link href="/discussions" className="hover:underline text-muted-foreground hover:text-primary">Discussions</Link></li>
              <li><Link href="/profile" className="hover:underline text-muted-foreground hover:text-primary">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-headline">Company</h3>
            <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:underline text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="hover:underline text-muted-foreground hover:text-primary">Contact Us</Link></li>
                <li><Link href="#" className="hover:underline text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:underline text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Copyright className="h-4 w-4" />
                <p>{currentYear} ECET Prep Platform. All Rights Reserved.</p>
            </div>
             <div className="flex items-center gap-2 mt-4 sm:mt-0">
                <span>Contact:</span>
                <a href="mailto:help@ecetprep.in" className="font-medium hover:underline text-primary">help@ecetprep.in</a>
            </div>
        </div>
      </div>
    </footer>
  )
}
