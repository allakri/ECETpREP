
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const { toast } = useToast();
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [supabase] = useState(() => createClient());

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const userData = {
      name: formData.get("name") as string,
      phone_number: formData.get("phoneNumber") as string,
      branch: formData.get("branch") as string,
      college: formData.get("college") as string,
      year_of_study: year,
    };
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Registration Pending",
        description: "Please check your email to verify your account.",
      });
       // Clear form after successful submission
      (e.target as HTMLFormElement).reset();
      setYear("");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Create an account</CardTitle>
            <CardDescription>Enter your details to get started. Fields marked with <span className="text-destructive">*</span> are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number <span className="text-destructive">*</span></Label>
                <Input id="phoneNumber" name="phoneNumber" placeholder="+1 234 567 890" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Branch <span className="text-destructive">*</span></Label>
                <Input id="branch" name="branch" placeholder="Computer Science" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="college">College Name <span className="text-destructive">*</span></Label>
                <Input id="college" name="college" placeholder="University of Technology" required />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="yearOfStudy">Year of Study <span className="text-destructive">*</span></Label>
                <Select required onValueChange={setYear} value={year}>
                  <SelectTrigger id="yearOfStudy">
                    <SelectValue placeholder="Select your year of study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-primary">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
