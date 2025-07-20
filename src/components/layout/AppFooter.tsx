
"use client"

import Link from "next/link";
import { Copyright, Rocket } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

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
            <div className="flex gap-4 mt-4 sm:mt-0">
                <p>Visitors: 1,077,492</p>
                <p>Mock Tests Taken: 38,144</p>
            </div>
        </div>
      </div>
    </footer>
  )
}
