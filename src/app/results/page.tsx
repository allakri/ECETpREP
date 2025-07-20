import ResultsClient from "@/components/results/ResultsClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

function ResultsFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 md:p-8">
            <div className="w-full max-w-7xl mx-auto space-y-6">
                <Skeleton className="h-10 w-1/3 mb-2" />
                <Skeleton className="h-5 w-2/3" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="lg:col-span-1 h-full">
                         <Skeleton className="h-[450px] w-full rounded-lg" />
                    </div>
                     <div className="lg:col-span-1 h-full">
                         <Skeleton className="h-[450px] w-full rounded-lg" />
                    </div>
                     <div className="lg:col-span-1 h-full">
                         <Skeleton className="h-[450px] w-full rounded-lg" />
                    </div>
                </div>
                 <Skeleton className="h-16 w-full rounded-lg" />
            </div>
        </div>
    )
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<ResultsFallback />}>
            <ResultsClient />
        </Suspense>
    );
}
