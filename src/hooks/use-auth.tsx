
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, SupabaseClient } from '@supabase/supabase-js';

// Define our custom user profile type
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  branch: string;
  college: string;
  yearOfStudy: string;
}

// Combine Supabase user and our profile
type User = SupabaseUser & UserProfile;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (details: Partial<UserProfile>) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    // In a real app, you would fetch from a 'profiles' table
    // For now, we'll use the metadata and mock the rest
    const userMetadata = supabaseUser.user_metadata;
    if (userMetadata) {
      return {
        ...supabaseUser,
        name: userMetadata.name || 'No Name',
        phoneNumber: userMetadata.phone_number || 'No Phone',
        branch: userMetadata.branch || 'No Branch',
        college: userMetadata.college || 'No College',
        yearOfStudy: userMetadata.year_of_study || 'No Year',
        // id is already in supabaseUser
        // email is already in supabaseUser
      };
    }
    return null;
  }, []);


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
          setIsAdmin(userProfile?.email === 'admin@ecet.com');
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Initial check
    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const userProfile = await fetchUserProfile(session.user);
            setUser(userProfile);
            setIsAdmin(userProfile?.email === 'admin@ecet.com');
        }
        setLoading(false);
    };
    checkUser();


    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, fetchUserProfile]);
  
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.refresh();
    router.push('/login');
  };

  const updateUser = async (details: Partial<UserProfile>) => {
    if (!user) return;
    // In a real app, you'd update the database.
    // Here we just update local state.
    const updatedUser = { ...user, ...details };
    setUser(updatedUser);
    // You would also call supabase.auth.updateUser({ data: ... })
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
