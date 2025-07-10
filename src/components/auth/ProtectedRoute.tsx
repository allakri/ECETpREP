"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
};

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { appUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!loading && !appUser) {
      router.replace('/');
      return;
    }

    // If a role is required and the user doesn't have it, redirect to home
    if (!loading && requiredRole && appUser?.role !== requiredRole) {
      router.replace('/home');
    }
  }, [appUser, loading, requiredRole, router]);

  // While loading or if the user doesn't meet role requirements, show a loading indicator
  if (loading || !appUser || (requiredRole && appUser.role !== requiredRole)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // If everything is fine, render the children
  return <>{children}</>;
}
