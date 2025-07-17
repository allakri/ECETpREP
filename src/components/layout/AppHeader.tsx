"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Rocket, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

export function AppHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/courses", label: "Courses" },
    { href: "/user-guide", label: "User Guide" },
    { href: "/contact", label: "Contact Us" },
  ];

  if (user) {
    navLinks.push({ href: "/dashboard", label: "Dashboard" });
    navLinks.push({ href: "/profile", label: "Profile" });
  }

  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
            <Rocket />
            <span>ECET Prep</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="link" className="text-primary-foreground text-base">
                  {link.label}
                </Button>
              </Link>
            ))}
             {user ? (
              <Button onClick={handleLogout} variant="ghost" className="text-primary-foreground text-base hover:bg-primary/80">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login" passHref><Button variant="ghost" className="text-primary-foreground text-base hover:bg-primary/80">Login</Button></Link>
                <Link href="/register" passHref><Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">Register</Button></Link>
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
                <div className="flex flex-col space-y-4 pt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} passHref>
                       <Button variant="ghost" className="w-full justify-start text-lg">{link.label}</Button>
                    </Link>
                  ))}
                  <hr/>
                  {user ? (
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-lg text-red-500 hover:text-red-600">
                      <LogOut className="mr-2 h-5 w-5" />
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Link href="/login" passHref><Button variant="ghost" className="w-full justify-start text-lg">Login</Button></Link>
                      <Link href="/register" passHref><Button className="w-full justify-center text-lg bg-accent text-accent-foreground hover:bg-accent/90">Register</Button></Link>
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
