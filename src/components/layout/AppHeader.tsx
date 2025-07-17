"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Menu, Rocket, User, LogOut, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AppHeader() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/courses", label: "Courses" },
    { href: "/user-guide", label: "User Guide" },
    { href: "/contact", label: "Contact Us" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl font-headline">
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
            {!loading && (
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <Button variant="ghost" onClick={() => router.push('/profile')}><User className="mr-2"/> Profile</Button>
                    <Button variant="ghost" onClick={() => router.push('/dashboard')}><LayoutDashboard className="mr-2"/> Dashboard</Button>
                    <Button variant="secondary" onClick={handleLogout}><LogOut className="mr-2"/> Logout</Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => router.push('/login')}><LogIn className="mr-2"/> Login</Button>
                    <Button variant="secondary" onClick={() => router.push('/register')}><UserPlus className="mr-2"/> Register</Button>
                  </>
                )}
              </div>
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
                  <div className="border-t pt-4 space-y-2">
                    {!loading && (
                      <>
                        {user ? (
                          <>
                             <Button variant="ghost" onClick={() => router.push('/profile')} className="w-full justify-start text-lg"><User className="mr-2"/> Profile</Button>
                             <Button variant="ghost" onClick={() => router.push('/dashboard')} className="w-full justify-start text-lg"><LayoutDashboard className="mr-2"/> Dashboard</Button>
                             <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-lg"><LogOut className="mr-2"/> Logout</Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" onClick={() => router.push('/login')} className="w-full justify-start text-lg"><LogIn className="mr-2"/> Login</Button>
                            <Button variant="ghost" onClick={() => router.push('/register')} className="w-full justify-start text-lg"><UserPlus className="mr-2"/> Register</Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
