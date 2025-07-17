
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { updateUserProfile } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email(),
  phone: z.string().min(10, { message: 'Enter a valid 10-digit phone number' }).max(10),
  college: z.string().min(1, { message: 'College name is required' }),
  branch: z.string().min(1, { message: 'Branch is required' }),
  year: z.string().min(1, { message: 'Year of study is required' }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        branch: user.branch,
        year: user.year,
      });
    }
  }, [user, loading, router, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!session) return;
    setIsLoading(true);
    try {
      await updateUserProfile(session.uid, data);
      toast({ title: 'Profile Updated', description: 'Your information has been saved.' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-grow flex items-center justify-center bg-secondary/30 py-12">
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            </main>
            <AppFooter />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center bg-secondary/30 py-12">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Your Profile</CardTitle>
            <CardDescription>View and update your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email (cannot be changed)</FormLabel><FormControl><Input type="email" {...field} disabled /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="college" render={({ field }) => (
                        <FormItem><FormLabel>College Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="branch" render={({ field }) => (
                        <FormItem><FormLabel>Branch</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="year" render={({ field }) => (
                        <FormItem><FormLabel>Year of Study</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="1st Year">1st Year</SelectItem>
                                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                                    <SelectItem value="4th Year">4th Year</SelectItem>
                                </SelectContent>
                            </Select>
                        <FormMessage /></FormItem>
                    )} />
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
