"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu, Rocket } from "lucide-react";

export function AppHeader() {
  const router = useRouter();
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/courses", label: "Courses" },
    { href: "/user-guide", label: "User Guide" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
            <Rocket />
            <span>ECET Prep</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="link" className="text-primary-foreground text-base">
                  {link.label}
                </Button>
              </Link>
            ))}
             <Button variant="secondary" onClick={() => router.push('/login')}>Login</Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background text-foreground">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Main navigation links for the ECET Prep Platform.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 pt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} passHref>
                       <Button variant="ghost" className="w-full justify-start text-lg">{link.label}</Button>
                    </Link>
                  ))}
                  <Button variant="default" onClick={() => router.push('/login')} className="w-full text-lg">Login</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
