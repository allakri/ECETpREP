
"use client"

import Link from "next/link";
import { Copyright, Rocket } from "lucide-react";
import { useState, useEffect } from 'react';

const CountUp = ({ end }: { end: number }) => {
    const [count, setCount] = useState(0);
    const duration = 2000; // 2 seconds

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
                setCount(end); // Ensure it ends exactly on the end number
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex justify-center md:justify-start items-center gap-2 mb-4">
                <Rocket className="text-primary"/>
                <h3 className="font-bold text-lg font-headline text-primary">ECET Prep Platform</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your comprehensive resource for acing the Engineering Common Entrance Test.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/exams" className="hover:underline text-muted-foreground hover:text-primary">Exams</Link></li>
              <li><Link href="/roadmap" className="hover:underline text-muted-foreground hover:text-primary">Roadmap</Link></li>
              <li><Link href="/discussions" className="hover:underline text-muted-foreground hover:text-primary">Discussions</Link></li>
              <li><Link href="/courses" className="hover:underline text-muted-foreground hover:text-primary">Courses</Link></li>
              <li><Link href="/contact" className="hover:underline text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="/user-guide" className="hover:underline text-muted-foreground hover:text-primary">User Guide</Link></li>
              <li><Link href="/profile" className="hover:underline text-muted-foreground hover:text-primary">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-headline">Legal</h3>
            <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:underline text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:underline text-muted-foreground hover:text-primary">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Copyright className="h-4 w-4" />
                <p>{currentYear} ECET Prep Platform. All Rights Reserved.</p>
            </div>
            <div className="flex gap-4 mt-4 sm:mt-0 font-medium">
                <p>Visitors: {isMounted ? <CountUp end={1077492} /> : 0}</p>
                <p>Mock Tests Taken: {isMounted ? <CountUp end={38144} /> : 0}</p>
            </div>
        </div>
      </div>
    </footer>
  )
}
