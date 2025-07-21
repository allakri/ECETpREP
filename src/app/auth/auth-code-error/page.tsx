import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <Card className="max-w-lg w-full shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 text-destructive rounded-full p-4 w-fit mb-4">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-headline text-destructive">
              Authentication Error
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              There was a problem verifying your authentication token. This could be because the link has expired or has already been used. Please try logging in again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
