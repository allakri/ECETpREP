
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().min(10, { message: 'Enter a valid 10-digit phone number' }).max(10),
  college: z.string().min(1, { message: 'College name is required' }),
  branch: z.string().min(1, { message: 'Branch is required' }),
  year: z.string().min(1, { message: 'Year of study is required' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      college: '',
      branch: '',
      year: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await register(data);
      toast({ title: 'Registration Successful', description: 'Your account has been created.' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center bg-secondary/30 py-12">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">Create an Account</CardTitle>
            <CardDescription>Fill in your details to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="student@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="college" render={({ field }) => (
                        <FormItem><FormLabel>College Name</FormLabel><FormControl><Input placeholder="Your College" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="branch" render={({ field }) => (
                        <FormItem><FormLabel>Branch</FormLabel><FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem><FormLabel>Year of Study</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select your year" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="1st Year">1st Year</SelectItem>
                                <SelectItem value="2nd Year">2nd Year</SelectItem>
                                <SelectItem value="3rd Year">3rd Year</SelectItem>
                                <SelectItem value="4th Year">4th Year</SelectItem>
                            </SelectContent>
                        </Select>
                    <FormMessage /></FormItem>
                )} />
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Register'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
             <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
