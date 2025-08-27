
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingFallback = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
)

export default function ExamInstructionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
        {children}
    </Suspense>
  );
}
