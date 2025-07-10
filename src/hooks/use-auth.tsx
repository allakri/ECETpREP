"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, User, AuthError } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storeUserInFirestore = async (user: User) => {
  if (!db || typeof db.collection !== 'function') {
    console.error("Firestore is not initialized. Cannot store user data.");
    return;
  }
  const userRef = doc(db, "users", user.uid);
  try {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
      role: "student", // Default role
    }, { merge: true });
  } catch (error) {
    console.error("Error storing user in Firestore:", error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (auth && typeof auth.onAuthStateChanged === 'function') {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
        if (!user) {
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
      const result = await signInWithPopup(auth, provider);
      await storeUserInFirestore(result.user);
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
         toast({
            title: "Sign-Out Failed",
            description: (error as Error).message,
            variant: "destructive",
        });
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
