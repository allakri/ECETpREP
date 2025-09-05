"use client"

import Link from "next/link";
import { Facebook, Twitter, Linkedin, Copyright } from "lucide-react";

const DiamondIcon = () => (
    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L44 24L24 44L4 24L24 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
        <path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" stroke="currentColor" strokeWidth="4"></path>
    </svg>
);


export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
     <footer className="border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4 md:col-span-2">
                    <div className="flex items-center gap-3 text-white">
                        <DiamondIcon />
                        <h2 className="text-white text-lg font-bold">Diploma Prep Hub</h2>
                    </div>
                    <p className="text-white/60 text-sm">Your partner in acing the ECET and building a successful engineering career.</p>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><a className="hover:text-white transition-colors" href="#">Home</a></li>
                        <li><a className="hover:text-white transition-colors" href="#">Exams</a></li>
                        <li><a className="hover:text-white transition-colors" href="#">Resources</a></li>
                        <li><a className="hover:text-white transition-colors" href="#">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-semibold mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm text-white/60">
                        <li><a className="hover:text-white transition-colors" href="mailto:support@diplomaprephub.com">support@diplomaprephub.com</a></li>
                        <li><a className="hover:text-white transition-colors" href="tel:+911234567890">+91 12345 67890</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-8 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-white/40">© {currentYear} Diploma Prep Hub. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a className="text-white/60 hover:text-white" href="#"><Facebook className="h-5 w-5" /></a>
                    <a className="text-white/60 hover:text-white" href="#"><Twitter className="h-5 w-5" /></a>
                    <a className="text-white/60 hover:text-white" href="#"><Linkedin className="h-5 w-5" /></a>
                </div>
            </div>
        </div>
    </footer>
  )
}
