
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile, getUserProfile } from '@/lib/firestore';
import type { AppUser, RegisterFormValues } from '@/lib/types';

interface AuthContextType {
    session: FirebaseUser | null;
    user: AppUser | null;
    loading: boolean;
    register: (data: RegisterFormValues) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setLoading(true);
            if (firebaseUser) {
                setSession(firebaseUser);
                const userProfile = await getUserProfile(firebaseUser.uid);
                setUser(userProfile);
            } else {
                setSession(null);
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const register = async (data: RegisterFormValues) => {
        const { email, password, ...profileData } = data;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(userCredential.user.uid, data);
        const userProfile = await getUserProfile(userCredential.user.uid);
        setUser(userProfile);
        setSession(userCredential.user);
    };

    const login = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userProfile = await getUserProfile(userCredential.user.uid);
        setUser(userProfile);
        setSession(userCredential.user);
    };

    const logout = async () => {
        await signOut(auth);
        setSession(null);
        setUser(null);
    };
    
    const value = {
        session,
        user,
        loading,
        register,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
