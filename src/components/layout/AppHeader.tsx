"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function AppHeader() {
  const router = useRouter();
  return (
    <header className="bg-primary/90 text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" passHref>
              <Button variant="link" className="text-primary-foreground text-base">Home</Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="link" className="text-primary-foreground text-base">About Us</Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="link" className="text-primary-foreground text-base">Courses</Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="link" className="text-primary-foreground text-base">User Guide</Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="link" className="text-primary-foreground text-base">Contact Us</Button>
            </Link>
          </div>
          <div>
            <Button variant="secondary" onClick={() => router.push('/login')}>Login</Button>
          </div>
        </nav>
      </div>
    </header>
  )
}
