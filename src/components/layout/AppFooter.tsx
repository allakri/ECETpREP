"use client"

import Link from "next/link";
import { Copyright } from "lucide-react";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="font-bold text-lg mb-4 font-headline">ECET Prep Platform</h3>
            <p className="text-sm text-primary-foreground/80">
              Your comprehensive resource for acing the Engineering Common Entrance Test.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-headline">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">About Us</Link></li>
              <li><Link href="/courses" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">Courses</Link></li>
              <li><Link href="/contact" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">Contact Us</Link></li>
              <li><Link href="/user-guide" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">User Guide</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 font-headline">Legal</h3>
            <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:underline text-primary-foreground/80 hover:text-primary-foreground">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-primary-foreground/60">
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
