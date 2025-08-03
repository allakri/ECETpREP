
import AnswerReviewClient from '@/components/exam/AnswerReviewClient';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export default function AnswerReviewPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow pt-8">
        <Breadcrumbs />
        <AnswerReviewClient />
      </main>
      <AppFooter />
    </div>
  );
}
