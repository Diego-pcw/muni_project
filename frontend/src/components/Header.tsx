// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header(): JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid #eee',
      background: '#fff'
    }}>
      <div style={{ display:'flex', gap: 16, alignItems:'center' }}>
        <Link to="/" style={{ fontWeight:700, textDecoration:'none' }}>MiApp</Link>

        <nav style={{ display:'flex', gap:12 }}>
          <Link to="/">Inicio</Link>
          <Link to="/comunicados">Comunicados</Link>
          <Link to="/formularios">Formularios</Link>
          {user?.rol === 'admin' && <Link to="/admin/dashboard">Dashboard (Admin)</Link>}
        </nav>
      </div>

      <div style={{ display:'flex', gap:12, alignItems:'center' }}>
        {!user ? (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        ) : (
          <>
            <span style={{ color:'#333' }}>Hola, <strong>{user.name}</strong></span>
            <Link to="/profile" className="btn">Perfil</Link>
            <button onClick={handleLogout} className="btn">Logout</button>
          </>
        )}
      </div>
    </header>
  );
}

