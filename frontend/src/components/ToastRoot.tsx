// src/components/ToastRoot.tsx
import React from 'react';
import { useToast } from '../context/ToastContext';
import type { ToastItem } from '../context/ToastContext'; // <-- import type

function ToastView({ t }: { t: ToastItem }) {
  return (
    <div
      className={`toast-banner ${t.type === 'success' ? 'toast-success' : t.type === 'error' ? 'toast-error' : 'toast-info'}`}
      role="status"
      aria-live="polite"
      style={{
        pointerEvents: 'auto',
        padding: '10px 14px',
        borderRadius: 10,
        boxShadow: '0 6px 18px rgba(2,6,23,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: t.type === 'success' ? 'linear-gradient(90deg,#dcfce7,#bbf7d0)' :
                    t.type === 'error' ? 'linear-gradient(90deg,#fee2e2,#fecaca)' :
                    'linear-gradient(90deg,#e6f7ff,#cffafe)',
        color: '#0f172a',
        border: '1px solid rgba(0,0,0,0.04)',
        minWidth: 220,
        maxWidth: 680,
      }}
    >
      <span style={{ fontSize: 18 }}>
        {t.type === 'success' ? '✅' : t.type === 'error' ? '⚠️' : 'ℹ️'}
      </span>
      <div style={{ fontSize: 14 }}>{t.message}</div>
    </div>
  );
}

export default function ToastRoot(): JSX.Element {
  const { toasts } = useToast();

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 20,
        pointerEvents: 'none',
        zIndex: 1200,
        display: 'flex',
        justifyContent: 'center',
        padding: '0 12px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'auto', alignItems: 'center' }}>
        {toasts.map((t) => (
          <ToastView key={t.id} t={t} />
        ))}
      </div>
    </div>
  );
}
