
"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu, Rocket } from "lucide-react";
import { useState, useEffect } from 'react';

const DiamondIcon = () => (
    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L44 24L24 44L4 24L24 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
        <path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" stroke="currentColor" strokeWidth="4"></path>
    </svg>
);


export function AppHeader() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/exams", label: "Exams" },
    { href: "/resources", label: "Resources" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-white/10 px-4 md:px-10 py-5">
        <Link href="/" className="flex items-center gap-3 text-white">
            <DiamondIcon />
            <h2 className="hidden sm:block text-white text-xl font-bold leading-tight tracking-[-0.015em]">Diploma Prep Hub</h2>
        </Link>
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/80">
            {navLinks.map(link => (
                <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                </Link>
            ))}
        </nav>
        <div className="lg:hidden flex items-center">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-[#111714] text-white flex flex-col p-0 border-l-white/10">
                <SheetHeader className="p-4 border-b border-white/10">
                  <SheetTitle className="text-left text-2xl font-bold text-white">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-2 pt-4 flex-grow p-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} passHref>
                       <Button variant="ghost" className="w-full justify-start text-lg text-white/80 hover:text-white">{link.label}</Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
        </div>
    </header>
  )
}
