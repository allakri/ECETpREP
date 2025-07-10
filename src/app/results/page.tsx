import ResultsClient from "@/components/results/ResultsClient";
import { Suspense } from "react";

function ResultsFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading results...</p>
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
