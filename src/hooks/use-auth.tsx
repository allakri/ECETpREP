
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
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
  if (!db || typeof db.collection !== 'function') {
    throw new Error("Firestore not initialized");
  }
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
    if (!db || typeof db.collection !== 'function') {
        console.error("Firestore is not initialized. Cannot fetch user data.");
        return null;
    }
    const userRef = doc(db, 'users', user.uid);
    try {
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
    } catch (error) {
        const firebaseError = error as AuthError;
        if (firebaseError.code === 'unavailable' || firebaseError.code === 'failed-precondition' || firebaseError.message.includes('offline')) {
            console.warn("Firestore is temporarily unavailable or the client is offline. User data will be fetched later.");
        } else {
            console.error("An unexpected error occurred while fetching user data:", error);
        }
        return null;
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCareerGoalForm, setShowCareerGoalForm] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      setLoading(false);
      return;
    };
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        const customUserData = await fetchUserFromFirestore(firebaseUser);
        if (customUserData) {
            setAppUser(customUserData);
            if (!customUserData.careerGoal) {
                setShowCareerGoalForm(true);
            } else {
                setShowCareerGoalForm(false);
            }
        } else {
             const { isNew, role, careerGoal } = await storeUserInFirestore(firebaseUser);
             const newUser: AppUser = {
                 uid: firebaseUser.uid,
                 email: firebaseUser.email,
                 displayName: firebaseUser.displayName,
                 photoURL: firebaseUser.photoURL,
                 role,
                 careerGoal
             }
             setAppUser(newUser);
             if(isNew || !careerGoal) {
                 setShowCareerGoalForm(true);
             }
        }
      } else {
        setUser(null);
        setAppUser(null);
        setShowCareerGoalForm(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      toast({
        title: "Authentication Error",
        description: "Firebase is not configured correctly. Please check console.",
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
      setUser(result.user);
      setAppUser(currentUserData);
      
      if (isNew || !careerGoal) {
        setShowCareerGoalForm(true);
      } else {
        setShowCareerGoalForm(false);
        router.push('/');
      }

    } catch (error) {
      const authError = error as AuthError;
      if (authError.code !== 'auth/popup-closed-by-user') {
         console.error("Error during Google sign-in:", authError.code, authError.message);
         toast({
            title: "Sign-In Failed",
            description: "An unexpected error occurred during sign-in. Please try again.",
            variant: "destructive",
        });
      }
    } finally {
        setLoading(false);
    }
  };

  const handleSaveCareerGoal = async (goal: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { careerGoal: goal });
      setAppUser(prev => prev ? { ...prev, careerGoal: goal } : null);
      setShowCareerGoalForm(false);
      router.push('/');
    } catch (error) {
      console.error("Failed to save career goal", error);
      toast({ title: "Error", description: "Could not save your goal. Please try again.", variant: "destructive" });
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
        setUser(null);
        setAppUser(null);
        setShowCareerGoalForm(false);
        router.push('/login');
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

  const renderContent = () => {
    if (!isClient || loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      );
    }

    if (showCareerGoalForm && user) {
        const tempAppUser: AppUser = appUser || {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: "student",
            careerGoal: ""
        }
      return (
        <div className="flex items-center justify-center min-h-screen bg-secondary/30">
          <CareerGoalForm user={tempAppUser} onSave={handleSaveCareerGoal} />
        </div>
      );
    }
    
    return children;
  };
  
  return <AuthContext.Provider value={value}>{renderContent()}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
