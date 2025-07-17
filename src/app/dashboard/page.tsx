import DashboardClient from '@/components/dashboard/DashboardClient';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { AuthProvider } from '@/hooks/use-auth';

export default function DashboardPage() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow bg-secondary/30">
          <DashboardClient />
        </main>
        <AppFooter />
      </div>
    </AuthProvider>
  );
}
