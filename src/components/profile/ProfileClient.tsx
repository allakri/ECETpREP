"use client";

import { useAuth } from "@/hooks/use-auth";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  careerGoal: z.string().min(3, "Career goal must be at least 3 characters long.").max(100, "Career goal is too long."),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileClient() {
  const { appUser, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      careerGoal: appUser?.careerGoal || "",
    },
    values: { // ensures form is updated when appUser loads
        careerGoal: appUser?.careerGoal || "",
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    if (!appUser) {
      toast({ title: "Error", description: "You must be logged in to update your profile.", variant: "destructive" });
      return;
    }
    try {
      const userRef = doc(db, "users", appUser.uid);
      await updateDoc(userRef, {
        careerGoal: data.careerGoal,
      });
      toast({ title: "Success!", description: "Your career goal has been updated." });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({ title: "Error", description: "Failed to update your profile. Please try again.", variant: "destructive" });
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow bg-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-primary">My Profile</CardTitle>
              <CardDescription>View and manage your personal information and career aspirations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Name</Label>
                <p className="text-lg font-semibold">{appUser?.displayName}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-lg">{appUser?.email}</p>
              </div>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="careerGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>My Career Goal</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer, Doctor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Goal
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
