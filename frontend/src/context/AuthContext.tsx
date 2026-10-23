"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api, getToken, setToken, removeToken } from "@/lib/api";

interface UserProfile {
  institution: string;
  degree: string;
  academic_year: number;
  target_career_slug: string;
  weekly_study_hours: number;
  bio: string;
  github_url: string;
  linkedin_url: string;
  portfolio_published: boolean;
  onboarding_completed: boolean;
}

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  profile: UserProfile;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; full_name: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const data = await api.auth.getMe();
      setUser(data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await api.auth.login(credentials);
    setToken(data.access_token);
    await refreshUser();
  };

  const register = async (userData: { email: string; password: string; full_name: string }) => {
    const data = await api.auth.register(userData);
    setToken(data.access_token);
    await refreshUser();
  };

  const logout = () => {
    removeToken();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
