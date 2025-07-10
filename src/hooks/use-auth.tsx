
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, User, AuthError } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import { CareerGoalForm } from '@/components/auth/CareerGoalForm';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: string;
  careerGoal?: string;
}

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const storeUserInFirestore = async (user: User): Promise<{ isNew: boolean, role: string, careerGoal?: string }> => {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const userRole = user.email === 'raiabhishek3646@gmail.com' ? 'admin' : 'student';
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
      photoURL: user.photoURL,
      lastLogin: serverTimestamp(),
      role: userRole,
      careerGoal: "", // Initialize career goal
    });
    return { isNew: true, role: userRole };
  } else {
    await updateDoc(userRef, { lastLogin: serverTimestamp() });
    const data = userDoc.data();
    return { isNew: false, role: data.role || 'student', careerGoal: data.careerGoal };
  }
};

const fetchUserFromFirestore = async (user: User): Promise<AppUser | null> => {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: userData.role || 'student',
            careerGoal: userData.careerGoal || '',
        };
    }
    return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth?.onAuthStateChanged) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        try {
          const customUserData = await fetchUserFromFirestore(user);
          setAppUser(customUserData);
          if (customUserData && !customUserData.careerGoal) {
             const { isNew } = await storeUserInFirestore(user); // Check if they are actually new
             if (isNew) {
               setIsNewUser(true);
             }
          }
        } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
            if ((error as AuthError).code === 'unavailable') {
                 toast({
                    title: "Network Error",
                    description: "Could not connect to the database. Please check your network connection.",
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Connection Issue",
                    description: "Could not fetch user data. You might be offline.",
                    variant: "destructive"
                });
            }
            setAppUser(null);
        }
      } else {
        setUser(null);
        setAppUser(null);
        if (window.location.pathname !== '/') {
            router.push('/');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, toast]);

  const signInWithGoogle = async () => {
    if (!auth?.onAuthStateChanged) {
      toast({
        title: "Authentication Error",
        description: "Firebase is not configured. Please check your .env file.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { isNew, role, careerGoal } = await storeUserInFirestore(result.user);
      
      const currentUserData: AppUser = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        role: role,
        careerGoal: careerGoal || ""
      }
      setAppUser(currentUserData);
      
      if (isNew && !careerGoal) {
        setIsNewUser(true);
      } else {
        router.push('/home');
      }

    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/popup-closed-by-user') {
        // This is a normal user action, so we don't need to show an error.
        console.log("Sign-in popup closed by user.");
        return;
      }
      
      console.error("Error during Google sign-in:", authError.code, authError.message);
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

  const handleSaveCareerGoal = async (goal: string) => {
    if (!appUser) return;
    try {
      setLoading(true);
      const userRef = doc(db, "users", appUser.uid);
      await updateDoc(userRef, { careerGoal: goal });
      setAppUser(prev => prev ? { ...prev, careerGoal: goal } : null);
      setIsNewUser(false);
      router.push('/home');
    } catch (error) {
      console.error("Failed to save career goal", error);
      toast({ title: "Error", description: "Could not save your goal. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
     if (!auth?.onAuthStateChanged) {
      console.error("Firebase is not configured. Cannot sign out.");
      return;
    }
    setLoading(true);
    try {
        await firebaseSignOut(auth);
        setAppUser(null);
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
    appUser,
    loading,
    signInWithGoogle,
    signOut,
  };

  if (loading) {
    return (
       <div className="flex items-center justify-center min-h-screen">
         <p>Loading...</p>
       </div>
    )
  }
  
  if (isNewUser && appUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/30">
        <CareerGoalForm user={appUser} onSave={handleSaveCareerGoal} />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
