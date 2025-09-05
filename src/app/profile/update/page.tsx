
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Loader2, KeyRound } from "lucide-react";
import type { User } from "@supabase/supabase-js";


export default function UpdatePasswordPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        if (session?.user) {
            setUser(session.user);
        }
        setPageLoading(false);
      } else if (event === 'SIGNED_IN') {
        // This handles cases where user is already logged in
        if (session?.user) {
            setUser(session.user);
        }
        setPageLoading(false);
      } else {
        // If not a recovery link or signed in, check if there's a session
        const checkSession = async () => {
             const { data: { session } } = await supabase.auth.getSession();
             if(!session) {
                 toast({
                    variant: "destructive",
                    title: "Invalid or Expired Link",
                    description: "No active session found. Please request a new password reset link.",
                });
                router.replace('/login');
             }
             setPageLoading(false);
        }
        checkSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, toast]);

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your passwords are the same.",
      });
      return;
    }
    if (password.length < 6) {
        toast({
            variant: "destructive",
            title: "Password Too Short",
            description: "Your password must be at least 6 characters long.",
        });
        return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message,
      });
    } else {
      // Sign out to invalidate the recovery session
      await supabase.auth.signOut();
      setLoading(false);
      toast({
        title: "Password Updated Successfully!",
        description: "Please log in with your new password.",
      });
      router.push('/login');
    }
  };
  
  if (pageLoading) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                <KeyRound className="h-10 w-10" />
            </div>
            <CardTitle className="text-2xl font-headline text-primary">Update Your Password</CardTitle>
            <CardDescription>Enter and confirm a new password for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
