// src/pages/Profile.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Profile(): JSX.Element {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) return <div style={{ padding: 20 }}>Cargando perfil...</div>;

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <p>No autenticado.</p>
        <Link to="/login" className="btn">Iniciar sesión</Link>
      </div>
    );
  }

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
