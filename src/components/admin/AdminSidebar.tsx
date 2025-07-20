
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, Megaphone, Rocket, LogOut, Home } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

// --- Mock Admin Check ---
// In a real application, this would involve checking a user's role from a database.
const ADMIN_EMAIL = "admin@ecet.com";
// -----------------------

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/questions", label: "Test Questions", icon: FileText },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

const SidebarSkeleton = () => (
    <div className="w-64 border-r p-4 flex flex-col h-screen">
        <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
        <div className="mt-auto space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    </div>
)


export function AdminSidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.email !== ADMIN_EMAIL)) {
      // If not loading and user is not an admin, redirect to home.
      router.replace("/");
    }
  }, [user, loading, router]);
  
  if (!isMounted || loading || !user) {
    // Show skeleton or nothing while checking auth and mounting
    return <SidebarSkeleton />;
  }

  if (user.email !== ADMIN_EMAIL) {
    // This case is handled by the useEffect redirect, but it's a good safeguard.
    return null;
  }

  return (
    <aside className="w-64 border-r p-4 flex flex-col h-screen sticky top-0 bg-card">
      <div className="flex items-center gap-2 mb-8">
        <Rocket className="text-primary" />
        <h1 className="font-bold text-xl font-headline text-primary">Admin Panel</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} passHref>
              <Button
                variant={isActive ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-2">
         <Link href="/" passHref>
            <Button variant="outline" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Back to Site
            </Button>
        </Link>
        <Button onClick={logout} variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
      </div>
    </aside>
  );
}
