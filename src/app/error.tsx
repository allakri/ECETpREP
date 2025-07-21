
'use client'; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

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
              Something went wrong!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              We encountered an unexpected error. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
            >
              Try again
            </Button>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
