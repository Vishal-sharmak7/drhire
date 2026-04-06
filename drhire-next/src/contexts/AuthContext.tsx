'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/axios';
import type { User, AuthContextType, RegisterDoctorData, RegisterHospitalData } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { data } = await api.get<User>('/api/auth/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const response = await api.post<{ token: string }>('/api/auth/login', { email, password });
    const { token } = response.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    const { data: userData } = await api.get<User>('/api/auth/me');
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  }, []);

  const registerDoctor = useCallback(async (doctorData: RegisterDoctorData): Promise<User> => {
    await api.post('/api/auth/register/doctor', doctorData);
    const { data: userData } = await api.get<User>('/api/auth/me');
    setUser(userData);
    return userData;
  }, []);

  const registerHospital = useCallback(async (hospitalData: RegisterHospitalData): Promise<User> => {
    await api.post('/api/auth/register/hospital', hospitalData);
    const { data: userData } = await api.get<User>('/api/auth/me');
    setUser(userData);
    return userData;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        registerDoctor,
        registerHospital,
        setUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}