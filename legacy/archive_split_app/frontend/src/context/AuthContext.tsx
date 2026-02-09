'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  setAuthData: (accessToken: string, idToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async (authToken: string) => {
    const { data, error } = await api.get<User>('/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (data) {
      setUser(data);
    } else {
      console.error('Failed to fetch user:', error);
      logout();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = () => {
    // Redirect to backend login endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'}/auth/login`;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    setToken(null);
    setUser(null);
    router.push('/');
  };

  const setAuthData = (accessToken: string, idToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('id_token', idToken);
    setToken(accessToken);
    fetchUser(accessToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
