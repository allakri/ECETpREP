"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu, Rocket, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AppHeader() {
  const router = useRouter();
  const { appUser, signOut } = useAuth();

  const navLinks = [
    { href: "/home", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/courses", label: "Courses" },
    { href: "/user-guide", label: "User Guide" },
    { href: "/contact", label: "Contact Us" },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  }

  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/home" className="flex items-center gap-2 font-bold text-xl font-headline">
            <Rocket />
            <span>ECET Prep</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="link" className="text-primary-foreground text-base">
                  {link.label}
                </Button>
              </Link>
            ))}
             {appUser && (
                <>
                  <Link href="/profile" passHref>
                    <Button variant="ghost"><User className="mr-2 h-4 w-4"/>Profile</Button>
                  </Link>
                  <Button variant="secondary" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
                </>
             )}
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background text-foreground">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Main navigation links for the ECET Prep Platform.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 pt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} passHref>
                       <Button variant="ghost" className="w-full justify-start text-lg">{link.label}</Button>
                    </Link>
                  ))}
                  {appUser && (
                    <>
                      <Link href="/profile" passHref>
                        <Button variant="ghost" className="w-full justify-start text-lg"><User className="mr-2 h-4 w-4"/>Profile</Button>
                      </Link>
                      <Button variant="default" onClick={handleLogout} className="w-full text-lg"><LogOut className="mr-2 h-4 w-4"/>Logout</Button>
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
