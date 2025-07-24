
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
  current_streak: number;
  last_month_streak: number;
  highest_streak: number;
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
  current_streak?: number;
  last_month_streak?: number;
  highest_streak?: number;
};


// Combine Supabase user and our profile
export type User = SupabaseUser & UserProfile;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (details: UpdatableUserProfile) => Promise<void>;
  updateUserProgress: (currentUser: User, newScore: ExamScore) => Promise<void>;
  isAdmin: boolean;
  isInitialLoad: boolean; // Add this to track initial auth check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Start as true
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();
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
        current_streak: profileData.current_streak || 0,
        last_month_streak: profileData.last_month_streak || 0,
        highest_streak: profileData.highest_streak || 0,
    };
  }, [supabase]);


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
        setIsInitialLoad(false); // Set to false after the first check
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserProfile]);
  
  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const updateUser = async (details: UpdatableUserProfile) => {
    if (!user) return;

    const { error } = await supabase
        .from('profiles')
        .update({
            ...details,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (error) {
        console.error("Error updating user profile:", error);
        return;
    }

    // Refresh the local user state with the updated information
    const {data: { user: supabaseUser }} = await supabase.auth.getUser();
    if (supabaseUser) {
        const updatedUserProfile = await fetchUserProfile(supabaseUser);
        setUser(updatedUserProfile);
    }
  };

  const updateUserProgress = async (currentUser: User, newScore: ExamScore) => {
    if (!currentUser) return;

    // Calculate new progress metrics
    const newTestsTaken = currentUser.tests_taken + 1;
    const newHistory = [...currentUser.exam_score_history, newScore];
    const newAvgScore = newHistory.reduce((acc, item) => acc + item.score, 0) / newHistory.length;
    const newActivities = [...new Set([...currentUser.study_activities, newScore.date])];
    
    // TODO: Implement streak logic in the future

    const progressUpdate: UpdatableUserProfile = {
      tests_taken: newTestsTaken,
      avg_score: newAvgScore,
      exam_score_history: newHistory,
      study_activities: newActivities,
    };

    await updateUser(progressUpdate);
  };


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
