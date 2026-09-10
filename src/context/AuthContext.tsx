import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'patient' | 'caregiver';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  healthId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  onboardingComplete: boolean;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_BASE_URL, delay } from '../config/api';

const API_URL = API_BASE_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user_session');
        const storedToken = await AsyncStorage.getItem('user_token');
        const storedOnboarding = await AsyncStorage.getItem('onboarding_complete');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
        if (storedOnboarding === 'true') {
          setOnboardingComplete(true);
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSession();
  }, []);

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    await delay(1200);
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Registration failed');
    }

    const data = await response.json();
    setUser(data.user);
    setToken(data.token);
    setOnboardingComplete(data.onboardingComplete);
    await AsyncStorage.setItem('user_session', JSON.stringify(data.user));
    await AsyncStorage.setItem('user_token', data.token);
    await AsyncStorage.setItem('onboarding_complete', String(data.onboardingComplete));
  };

  const signIn = async (email: string, password: string) => {
    await delay(1200);
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    setToken(data.token);
    setOnboardingComplete(data.onboardingComplete);
    await AsyncStorage.setItem('user_session', JSON.stringify(data.user));
    await AsyncStorage.setItem('user_token', data.token);
    await AsyncStorage.setItem('onboarding_complete', String(data.onboardingComplete));
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_complete', 'true');
    setOnboardingComplete(true);
  };

  const signOut = async () => {
    try {
      setUser(null);
      setToken(null);
      setOnboardingComplete(false);
      await AsyncStorage.removeItem('user_session');
      await AsyncStorage.removeItem('user_token');
      await AsyncStorage.removeItem('onboarding_complete');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, token, onboardingComplete, register, signIn, signOut, completeOnboarding }}>
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
