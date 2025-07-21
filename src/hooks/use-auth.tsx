
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

// User profile data that can be updated
type UpdatableUserProfile = {
  name?: string;
  phone_number?: string;
  branch?: string;
  college?: string;
  year_of_study?: string;
};


// Combine Supabase user and our profile
type User = SupabaseUser & UserProfile;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (details: UpdatableUserProfile) => Promise<void>;
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
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
      console.error('Error fetching profile:', error);
      return null;
    }

    if (data) {
      return {
        ...supabaseUser,
        name: data.name || '',
        phoneNumber: data.phone_number || '',
        branch: data.branch || '',
        college: data.college || '',
        yearOfStudy: data.year_of_study || '',
      };
    }
    
     // Fallback to user_metadata if profile table is empty
    const userMetadata = supabaseUser.user_metadata;
    return {
      ...supabaseUser,
      name: userMetadata.name || 'No Name',
      phoneNumber: userMetadata.phone_number || 'No Phone',
      branch: userMetadata.branch || 'No Branch',
      college: userMetadata.college || 'No College',
      yearOfStudy: userMetadata.year_of_study || 'No Year',
    };
  }, [supabase]);


  useEffect(() => {
    // onAuthStateChange fires an initial session event, so we don't need a separate getSession() call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);
  
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    router.refresh();
    router.push('/login');
  };

  const updateUser = async (details: UpdatableUserProfile) => {
    if (!user) return;

    // 1. Update the user metadata in auth.users
    const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: details
    });

    if (authError) {
        console.error("Error updating user auth data:", authError);
        return;
    }

    // 2. Update the corresponding row in the public.profiles table
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
            ...details,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (profileError) {
        console.error("Error updating user profile:", profileError);
        return;
    }

    // 3. Refresh the local user state with the updated information
    if (authData.user) {
        const updatedUserProfile = await fetchUserProfile(authData.user);
        setUser(updatedUserProfile);
    }
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
