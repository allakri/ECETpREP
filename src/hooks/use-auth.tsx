
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { AppUser } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  userFromFirestore: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<any>;
  signup: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  setUserFromFirestore: React.Dispatch<React.SetStateAction<AppUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userFromFirestore, setUserFromFirestore] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicRoutes = ['/login', '/register', '/', '/about', '/courses', '/contact', '/user-guide'];

  useEffect(() => {
    // Check if auth object is valid before subscribing
    if (!auth?.onAuthStateChanged) {
        setLoading(false);
        return;
    }

    const fetchUserFromFirestore = async (firebaseUser: User) => {
      // Check if db object is valid before querying
      if (!db?.app) {
        console.warn("Firestore is not available. Skipping user data fetch.");
        return;
      }
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserFromFirestore(docSnap.data() as AppUser);
        } else {
          console.log("No such user in Firestore!");
        }
      } catch (error) {
        console.error("Error fetching user from Firestore:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserFromFirestore(firebaseUser);
      } else {
        setUser(null);
        setUserFromFirestore(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

   useEffect(() => {
    if (!loading && !user && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [user, loading, pathname, router, publicRoutes]);


  const login = (email: string, pass: string) => {
    if (!auth?.app) throw new Error("Firebase Auth is not initialized.");
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signup = (email: string, pass: string) => {
    if (!auth?.app) throw new Error("Firebase Auth is not initialized.");
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    if (!auth?.app) throw new Error("Firebase Auth is not initialized.");
    return signOut(auth);
  };

  const value = {
    user,
    userFromFirestore,
    loading,
    login,
    signup,
    logout,
    setUserFromFirestore
  };

  if (loading && !publicRoutes.includes(pathname)) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
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
