
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser, SupabaseClient, PostgrestError } from '@supabase/supabase-js';

export interface ExamScore {
  examName: string;
  score: number;
  date: string;
}

// Define our custom user profile type based on the new simplified schema
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  branch: string;
  college: string;
  yearOfStudy: string;
  avg_score: number;
  tests_taken: number;
  exam_score_history: ExamScore[]; // This will be fetched from the separate 'tests' table
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
  isInitialLoad: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_CACHE_KEY = 'diploma-prep-hub-user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

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
    // 1. Fetch from 'profiles' table (equivalent to user's 'users' table)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('name, phone_number, branch, college, year_of_study, avg_score, tests_taken')
      .eq('id', supabaseUser.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    // 2. Fetch last 5 tests from 'tests' table
    const { data: testsData, error: testsError } = await supabase
        .from('tests')
        .select('examName, score, date')
        .eq('user_id', supabaseUser.id)
        .order('date', { ascending: false })
        .limit(5);

    if (testsError) {
        console.error('Error fetching test history:', testsError);
        // We can still proceed without test history
    }

    const userMetadata = supabaseUser.user_metadata;
    const finalProfileData = profileData || {};

    return {
        ...supabaseUser,
        id: supabaseUser.id,
        name: finalProfileData.name || userMetadata.name || 'No Name',
        email: supabaseUser.email || '',
        phoneNumber: finalProfileData.phone_number || userMetadata.phone_number || '',
        branch: finalProfileData.branch || userMetadata.branch || '',
        college: finalProfileData.college || userMetadata.college || '',
        yearOfStudy: finalProfileData.year_of_study || userMetadata.year_of_study || '',
        avg_score: finalProfileData.avg_score || 0,
        tests_taken: finalProfileData.tests_taken || 0,
        exam_score_history: (testsData as ExamScore[] || []),
    };
  }, [supabase]);


  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        let userProfile = null;
        if (session?.user) {
          userProfile = await fetchUserProfile(session.user);
        }
        
        storeUser(userProfile);
        setLoading(false);
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
      }
    );

    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      let userProfile = null;
      if (session?.user) {
        userProfile = await fetchUserProfile(session.user);
      }
      storeUser(userProfile);
      setLoading(false);
      setIsInitialLoad(false);
    };

    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const {data: { user: supabaseUser }} = await supabase.auth.getUser();
    if (supabaseUser) {
        const updatedUserProfile = await fetchUserProfile(supabaseUser);
        storeUser(updatedUserProfile);
    }
  }, [user, supabase, fetchUserProfile]);

  const updateUserProgress = useCallback(async (newScoreData: ExamScore) => {
    if (!user) return;

    // 1. Insert the new test record
    const { error: insertError } = await supabase
        .from('tests')
        .insert({
            user_id: user.id,
            examName: newScoreData.examName,
            score: newScoreData.score,
            date: newScoreData.date
        });

    if (insertError) {
        console.error("Error inserting new test record:", insertError);
        return;
    }

    // 2. Fetch current stats to avoid race conditions
    const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('avg_score, tests_taken')
        .eq('id', user.id)
        .single();
    
    if (fetchError) {
        console.error("Error fetching current profile for update:", fetchError);
        return;
    }

    // 3. Calculate new average and count
    const oldAvg = currentProfile.avg_score || 0;
    const oldTakes = currentProfile.tests_taken || 0;
    const newTakes = oldTakes + 1;
    const newAvg = ((oldAvg * oldTakes) + newScoreData.score) / newTakes;

    // 4. Update the profiles table with new calculated stats
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            avg_score: newAvg,
            tests_taken: newTakes,
        })
        .eq('id', user.id);
    
    if (updateError) {
        console.error("Error updating user progress:", updateError);
        return;
    }

    // 5. Refresh local user state with all new information
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
