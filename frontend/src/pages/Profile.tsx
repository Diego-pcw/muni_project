// src/pages/Profile.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile(): JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return <div style={{ padding: 20 }}>No autenticado.</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Perfil</h2>
      <div className="card">
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.rol}</p>
        <p><strong>Estado:</strong> {user.estado}</p>
        <div style={{ marginTop: 12 }}>
          <button onClick={handleLogout} className="btn">Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}
