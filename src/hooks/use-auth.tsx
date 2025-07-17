
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Simplified user type for client-side only
interface User {
  name: string;
  email: string;
  phoneNumber: string;
  branch: string;
  college: string;
  yearOfStudy: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'email'> & { email: string }) => boolean;
  updateUser: (updatedDetails: Partial<Omit<User, 'email'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On initial load, check if user data exists in local storage
    try {
      const storedUser = localStorage.getItem('ecetUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('ecetUser');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email: string): boolean => {
    try {
      const storedUser = localStorage.getItem('ecetUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === email) {
          setUser(parsedUser);
          return true;
        }
      }
    } catch (error) {
       console.error("Failed during login", error);
    }
    return false;
  };

  const register = (userData: User): boolean => {
    try {
      // For simplicity, this mock auth overwrites any existing user.
      // A real backend would check for existing emails.
      localStorage.setItem('ecetUser', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error("Failed to register user", error);
      return false;
    }
  };

  const updateUser = (updatedDetails: Partial<Omit<User, 'email'>>) => {
    if (user) {
      const newUser = { ...user, ...updatedDetails };
      setUser(newUser);
      localStorage.setItem('ecetUser', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecetUser');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
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
