
import AnswerReviewClient from '@/components/exam/AnswerReviewClient';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
)

export default function AnswerReviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow pt-8">
        <Breadcrumbs />
        <Suspense fallback={<LoadingFallback />}>
          <AnswerReviewClient />
        </Suspense>
      </main>
      <AppFooter />
    </div>
  );
}

    