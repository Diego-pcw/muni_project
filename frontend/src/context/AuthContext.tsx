// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    setLoading(true);
    try {
      const res = await authService.profile();
      // Normaliza las distintas formas en que el backend puede devolver el user
      //  - { id:..., name:... }                 => res.data
      //  - { user: { ... } }                     => res.data.user
      //  - { data: { ... } }                     => res.data.data
      const payload = res?.data ?? null;
      let u: any = null;

      if (!payload) {
        u = null;
      } else if (payload.user) {
        u = payload.user;
      } else if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        u = payload.data;
      } else {
        u = payload;
      }

      setUser(u as User);
    } catch (err) {
      // Si falla, limpiamos token y ponemos user a null
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // on mount: si hay token, intentar obtener perfil
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    refreshProfile();

    // listener para logout emitido por api interceptor
    function handleExternalLogout() {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
    window.addEventListener('auth:logout', handleExternalLogout);
    return () => window.removeEventListener('auth:logout', handleExternalLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const token = res.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      await refreshProfile();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

