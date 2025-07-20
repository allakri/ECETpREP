
"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Rocket, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/exams", label: "Exams" },
    { href: "/discussions", label: "Discussions" },
    { href: "/about", label: "About Us" },
    { href: "/courses", label: "Courses" },
    { href: "/user-guide", label: "User Guide" },
    { href: "/contact", label: "Contact Us" },
  ];

  const protectedLinks = [
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline text-primary">
            <Rocket />
            <span>ECET Prep</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="link" className="text-foreground text-base hover:text-accent">
                  {link.label}
                </Button>
              </Link>
            ))}
            {user ? (
              <>
                {protectedLinks.map(link => (
                  <Link key={link.href} href={link.href} passHref>
                    <Button variant="link" className="text-foreground text-base hover:text-accent">{link.label}</Button>
                  </Link>
                ))}
                <Button onClick={logout} variant="ghost" className="text-foreground text-base hover:bg-secondary">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" passHref><Button variant="ghost" className="text-foreground text-base hover:bg-secondary">Login</Button></Link>
                <Link href="/register" passHref><Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">Register</Button></Link>
              </>
            )}
            <div className="pl-2">
              <ThemeToggle />
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background text-foreground">
                <div className="flex flex-col space-y-4 pt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} passHref>
                       <Button variant="ghost" className="w-full justify-start text-lg">{link.label}</Button>
                    </Link>
                  ))}
                  <hr/>
                   {user ? (
                    <>
                      {protectedLinks.map(link => (
                        <Link key={link.href} href={link.href} passHref>
                          <Button variant="ghost" className="w-full justify-start text-lg">{link.label}</Button>
                        </Link>
                      ))}
                      <Button onClick={logout} variant="ghost" className="w-full justify-start text-lg">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" passHref><Button variant="ghost" className="w-full justify-start text-lg">Login</Button></Link>
                      <Link href="/register" passHref><Button className="w-full justify-center text-lg bg-primary text-primary-foreground hover:bg-primary/90">Register</Button></Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
