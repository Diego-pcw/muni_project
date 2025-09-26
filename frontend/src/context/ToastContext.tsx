// src/context/ToastContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';
export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
};

type ToastContextType = {
  push: (message: string, type?: ToastType, duration?: number) => void;
  remove: (id: string) => void;
  toasts: ToastItem[];
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = (): ToastContextType => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, type: ToastType = 'info', duration = 3800) => {
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
    const t: ToastItem = { id, message, type, duration };
    setToasts((s) => [t, ...s]);
    // auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== id));
      }, duration + 100); // +100ms small buffer for exit animation
    }
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ push, remove, toasts }), [push, remove, toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
