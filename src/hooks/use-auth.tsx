"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
        if (!user) {
          // If user is not logged in, and not on the login page, redirect them.
          if (window.location.pathname !== '/') {
            router.push('/');
          }
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.warn("Firebase Auth is not available. Running in offline mode.");
      setLoading(false);
      return () => {}; // Return an empty function for cleanup
    }
  }, [router]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      throw error;
    } finally {
        setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Error during sign-out:", error);
    } finally {
        setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
