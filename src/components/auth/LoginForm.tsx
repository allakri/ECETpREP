"use client";

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export function LoginForm() {
  const router = useRouter();
  const { user, loading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/home');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push('/home');
    } catch (error) {
      console.error("Google Sign-In failed", error);
    }
  };
  
  if (loading || user) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <Card className="shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
          <Rocket className="h-8 w-8" />
        </div>
        <CardTitle className="font-headline text-3xl">ECET Prep Platform</CardTitle>
        <CardDescription>Sign in to start your journey</CardDescription>
      </CardHeader>
      <CardContent>
          <Button onClick={handleGoogleSignIn} disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg font-bold">
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
      </CardContent>
    </Card>
  );
}
