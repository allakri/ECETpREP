"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, User, AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    // Check if auth object is a valid Firebase auth instance.
    // The dummy object from firebase.ts won't have 'onAuthStateChanged'.
    if (auth && typeof auth.onAuthStateChanged === 'function') {
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
    } else {
      console.warn("Firebase Auth is not available. Running in offline mode.");
      setLoading(false);
      return () => {};
    }
  }, [router]);

  const signInWithGoogle = async () => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      toast({
        title: "Authentication Error",
        description: "Firebase is not configured. Please check your .env file.",
        variant: "destructive",
      })
      return;
    }
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error during Google sign-in:", authError.code);
      if (authError.code === 'auth/unauthorized-domain') {
        toast({
            title: "Domain Not Authorized",
            description: "This domain is not authorized for sign-in. Please add it to your Firebase project's authentication settings.",
            variant: "destructive",
            duration: 9000,
        });
      } else {
         toast({
            title: "Sign-In Failed",
            description: authError.message,
            variant: "destructive",
        });
      }
      throw error;
    } finally {
        setLoading(false);
    }
  };

  const signOut = async () => {
     if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      console.error("Firebase is not configured. Cannot sign out.");
      return;
    }
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
