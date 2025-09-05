
"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu, LogOut, Rocket, UserPlus, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "../ui/skeleton";
import { useState, useEffect } from 'react';

const DiamondIcon = () => (
    <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 4L44 24L24 44L4 24L24 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"></path>
        <path d="M24 29C26.7614 29 29 26.7614 29 24C29 21.2386 26.7614 19 24 19C21.2386 19 19 21.2386 19 24C19 26.7614 21.2386 29 24 29Z" stroke="currentColor" strokeWidth="4"></path>
    </svg>
);


export function AppHeader() {
  const { user, logout, isInitialLoad } = useAuth();
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
  
  const AuthButtons = () => {
    if (isInitialLoad || !isMounted) {
      return <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>;
    }

    if (user) {
      return (
        <div className="flex items-center gap-2">
          <Button onClick={logout} variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="text-white hover:text-primary">
            <Link href="/login">
                <LogIn className="mr-2 h-4 w-4"/>
                Login
            </Link>
        </Button>
        <Button asChild className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-primary text-primary-foreground text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-colors">
          <Link href="/register">
             <UserPlus className="mr-2 h-4 w-4"/>
            <span className="truncate">Register</span>
          </Link>
        </Button>
      </div>
    );
  };


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
             {!isInitialLoad && user && (
                <Link href="/profile" className="hover:text-white transition-colors">
                    Profile
                </Link>
            )}
        </nav>
        <div className="hidden lg:flex">
          <AuthButtons />
        </div>
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
                  {!isInitialLoad && user && (
                    <Link href="/profile" passHref>
                       <Button variant="ghost" className="w-full justify-start text-lg text-white/80 hover:text-white">Profile</Button>
                    </Link>
                  )}
                </div>
                <div className="border-t border-white/10 p-4">
                   {isInitialLoad || !isMounted ? (
                      <Skeleton className="h-10 w-full" />
                   ) : user ? (
                      <Button onClick={logout} variant="outline" className="w-full justify-center text-lg bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Link href="/login" passHref><Button variant="outline" className="w-full justify-center text-lg bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white">Login</Button></Link>
                        <Link href="/register" passHref><Button className="w-full justify-center text-lg bg-primary text-primary-foreground hover:bg-primary/90">Register</Button></Link>
                      </div>
                    )
                   }
                </div>
              </SheetContent>
            </Sheet>
        </div>
    </header>
  )
}
