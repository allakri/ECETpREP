
"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu, Rocket, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  const { user, logout, isInitialLoad } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/exams", label: "Exams" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/discussions", label: "Discussions" },
    { href: "/courses", label: "Courses" },
    { href: "/user-guide", label: "User Guide" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];
  
  const allNavLinks = user
    ? [...navLinks, { href: "/profile", label: "Profile" }]
    : navLinks;

  return (
    <header className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline text-primary">
            <Rocket />
            <span>ECET Prep</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {allNavLinks.map(link => (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="link" className="text-foreground text-base hover:text-accent">
                  {link.label}
                </Button>
              </Link>
            ))}
            <div className="pl-2 flex items-center gap-2">
              {!isInitialLoad && (
                  user ? (
                    <Button onClick={logout} variant="ghost" className="text-foreground text-base hover:bg-secondary">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link href="/login" passHref><Button variant="ghost" className="text-foreground text-base hover:bg-secondary">Login</Button></Link>
                      <Link href="/register" passHref><Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">Register</Button></Link>
                    </>
                  )
              )}
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
              <SheetContent side="right" className="w-full max-w-xs bg-background text-foreground flex flex-col">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-left text-2xl font-headline text-primary">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-2 pt-4 flex-grow">
                  {allNavLinks.map((link) => (
                    <Link key={link.href} href={link.href} passHref>
                       <Button variant="ghost" className="w-full justify-start text-lg">{link.label}</Button>
                    </Link>
                  ))}
                </div>
                <div className="border-t pt-4">
                   {!isInitialLoad && (
                       user ? (
                          <Button onClick={logout} variant="outline" className="w-full justify-center text-lg">
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                          </Button>
                      ) : (
                        <div className="space-y-2">
                          <Link href="/login" passHref><Button variant="outline" className="w-full justify-center text-lg">Login</Button></Link>
                          <Link href="/register" passHref><Button className="w-full justify-center text-lg bg-primary text-primary-foreground hover:bg-primary/90">Register</Button></Link>
                        </div>
                      )
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
