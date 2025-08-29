
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, SupabaseClient } from '@supabase/supabase-js';
import { Skeleton } from '@/components/ui/skeleton';

export interface ExamScore {
  examName: string;
  score: number;
  date: string;
}

// Define our custom user profile type
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  branch: string;
  college: string;
  yearOfStudy: string;
  // New progress fields
  avg_score: number;
  tests_taken: number;
  study_activities: string[]; // Array of dates 'yyyy-MM-dd'
  exam_score_history: ExamScore[];
}

// User profile data that can be updated
type UpdatableUserProfile = {
  name?: string;
  phone_number?: string;
  branch?: string;
  college?: string;
  year_of_study?: string;
  avg_score?: number;
  tests_taken?: number;
  study_activities?: string[];
  exam_score_history?: ExamScore[];
};


// Combine Supabase user and our profile
export type User = SupabaseUser & UserProfile;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (details: Partial<UpdatableUserProfile>) => Promise<void>;
  updateUserProgress: (newScore: ExamScore) => Promise<void>;
  isAdmin: boolean;
  isInitialLoad: boolean; // Add this to track initial auth check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_CACHE_KEY = 'diploma-prep-hub-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Start as true
  const [isAdmin, setIsAdmin] = useState(false);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  // Function to save user to state and localStorage
  const storeUser = (user: User | null) => {
    setUser(user);
    setIsAdmin(user?.email === 'admin@ecet.com');
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_CACHE_KEY);
    }
  };

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

    const userMetadata = supabaseUser.user_metadata;
    const profileData = data || {};

    return {
        ...supabaseUser,
        id: supabaseUser.id,
        name: profileData.name || userMetadata.name || 'No Name',
        email: supabaseUser.email || '',
        phoneNumber: profileData.phone_number || userMetadata.phone_number || 'No Phone',
        branch: profileData.branch || userMetadata.branch || 'No Branch',
        college: profileData.college || userMetadata.college || 'No College',
        yearOfStudy: profileData.year_of_study || userMetadata.year_of_study || 'No Year',
        avg_score: profileData.avg_score || 0,
        tests_taken: profileData.tests_taken || 0,
        study_activities: profileData.study_activities || [],
        exam_score_history: profileData.exam_score_history || [],
    };
  }, [supabase]);


  useEffect(() => {
    // On initial mount, try to load user from cache to prevent UI flicker
    try {
        const cachedUser = localStorage.getItem(USER_CACHE_KEY);
        if (cachedUser) {
            storeUser(JSON.parse(cachedUser));
        }
    } catch (e) {
        console.error("Failed to parse cached user", e);
        localStorage.removeItem(USER_CACHE_KEY);
    }
    // We still set loading to true initially until the server confirms auth state.
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          storeUser(userProfile);
        } else {
          storeUser(null);
        }
        setLoading(false);
        setIsInitialLoad(false); // Set to false after the first check
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);
  
  const logout = async () => {
    await supabase.auth.signOut();
    storeUser(null);
    router.refresh();
  };

  const updateUser = useCallback(async (details: Partial<UpdatableUserProfile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(details, { returning: 'minimal' })
      .eq('id', user.id);


    if (error) {
        console.error("Error updating user profile:", error);
        return;
    }

    // Refresh the local user state with the updated information
    const {data: { user: supabaseUser }} = await supabase.auth.getUser();
    if (supabaseUser) {
        const updatedUserProfile = await fetchUserProfile(supabaseUser);
        storeUser(updatedUserProfile);
    }
  }, [user, supabase, fetchUserProfile]);

  const updateUserProgress = useCallback(async (newScore: ExamScore) => {
    if (!user) return;

    // Calculate new progress metrics
    const newTestsTaken = user.tests_taken + 1;
    const newHistory = [...user.exam_score_history, newScore];
    const newAvgScore = newHistory.reduce((acc, item) => acc + item.score, 0) / newHistory.length;
    const newActivities = [...new Set([...user.study_activities, newScore.date])];
    
    const { error } = await supabase
        .from('profiles')
        .update({
            avg_score: newAvgScore,
            tests_taken: newTestsTaken,
            exam_score_history: newHistory as any, // Supabase might need 'any' for JSONB
            study_activities: newActivities,
        })
        .eq('id', user.id);

    if (error) {
        console.error("Error updating user progress:", error);
        return;
    }

    // Refresh the local user state with the updated information
    const {data: { user: supabaseUser }} = await supabase.auth.getUser();
    if (supabaseUser) {
        const updatedUserProfile = await fetchUserProfile(supabaseUser);
        storeUser(updatedUserProfile);
    }
  }, [user, supabase, fetchUserProfile]);


  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUser, updateUserProgress, isAdmin, isInitialLoad }}>
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
