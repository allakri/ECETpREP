
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-grow">
                {children}
            </main>
            <AppFooter />
        </div>
    );
}
