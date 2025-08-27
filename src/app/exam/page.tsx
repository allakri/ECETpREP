
import ExamClient from '@/components/exam/ExamClient';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const ExamPageFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Exam...</p>
    </div>
);


export default function ExamPage() {
  return (
    <Suspense fallback={<ExamPageFallback />}>
        <ExamClient />
    </Suspense>
  );
}
