
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div>
          <SearchX className="mx-auto h-20 w-20 text-primary animate-bounce" />
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl font-headline">
            Page Not Found
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Oops! The page you are looking for does not exist. It might have been moved or deleted.
          </p>
          <Button asChild className="mt-10">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
