
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Users, FileText, Megaphone, Rocket, LogOut, Home, Menu } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/questions", label: "Test Questions", icon: FileText },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
];

const SidebarSkeleton = () => (
    <div className="w-64 border-r p-4 flex-col h-screen hidden md:flex">
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

const SidebarContent = () => {
    const pathname = usePathname();
    const { logout } = useAuth();
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-8 p-4">
                <Rocket className="text-primary" />
                <h1 className="font-bold text-xl font-headline text-primary">Admin Panel</h1>
            </div>
            <nav className="flex flex-col gap-2 px-4">
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
            <div className="mt-auto flex flex-col gap-2 p-4 border-t">
                <Link href="/" passHref>
                    <Button variant="outline" className="w-full justify-start">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Site
                    </Button>
                </Link>
                <Button onClick={() => logout()} variant="outline" className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}

export function AdminSidebar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);
  
  if (!isMounted || loading || !user) {
    return (
        <>
            <div className="md:hidden p-4">
                <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <SidebarSkeleton />
        </>
    );
  }

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden p-4 sticky top-0 bg-background z-10 border-b">
         <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Admin Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r h-screen sticky top-0 bg-card hidden md:flex flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
