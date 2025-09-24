// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

  // Refresh profile: normaliza distintas formas de respuesta del backend
  const refreshProfile = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await authService.profile();
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
      // falló: limpiar token y estado de usuario
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
        return;
      }
      // si hay token, intentar cargar perfil
      try {
        await refreshProfile();
      } catch {
        // ignore here; refreshProfile ya maneja limpieza
      }
    };

    init();

    // Listener global para logout emitido por api interceptor
    const handleExternalLogout = () => {
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    };
    window.addEventListener('auth:logout', handleExternalLogout);

    return () => {
      mounted = false;
      window.removeEventListener('auth:logout', handleExternalLogout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      const token = res.data?.token;
      if (token) {
        localStorage.setItem('token', token);
      }
      // después de guardar token, refrescar perfil
      await refreshProfile();
      // opcional: navega a /dashboard aquí si lo quieres (no lo hago en el context)
    } finally {
      setLoading(false);
    }
  }, [refreshProfile]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore errors from backend logout
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

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
