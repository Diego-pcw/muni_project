// src/pages/Profile.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/users.shared.css'; // asegúrate de importar estilos si no están globales

export default function Profile(): JSX.Element {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) return <div className="profile-page"><div className="profile-loading">Cargando perfil...</div></div>;

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card-blank">
          <p>No autenticado.</p>
          <Link to="/login" className="btn btn-primary">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  // initials for avatar fallback
  const initials = (user.name || '')
    .split(' ')
    .map(s => s?.[0])
    .filter(Boolean)
    .slice(0,2)
    .join('')
    .toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-hero-left">
          <div className="profile-avatar">{initials || 'U'}</div>
        </div>

        <div className="profile-hero-right">
          <h1 className="profile-name">{user.name}</h1>
          <div className="profile-meta">
            <span className={`badge ${user.estado === 'activo' ? 'badge-success' : 'badge-muted'}`}>{user.estado}</span>
            <span className="profile-role">{user.rol}</span>
          </div>

          <div className="profile-actions" role="group" aria-label="acciones de perfil">
            <Link to="/profile/edit" className="btn btn-outline">Editar perfil</Link>
            <button className="btn btn-primary" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-details">
          <div className="profile-row">
            <div className="profile-label">Email</div>
            <div className="profile-value">{user.email}</div>
          </div>

          <div className="profile-row">
            <div className="profile-label">Rol</div>
            <div className="profile-value">{user.rol}</div>
          </div>

          <div className="profile-row">
            <div className="profile-label">Estado</div>
            <div className="profile-value">{user.estado}</div>
          </div>

          {/* Si quieres mostrar campos extra que existan en user, agrégalos aquí */}
          { (user.created_at || user.updated_at) && (
            <div className="profile-row">
              <div className="profile-label">Registrado</div>
              <div className="profile-value">{ user.created_at ? new Date(user.created_at).toLocaleString() : '-' }</div>
            </div>
          )}

        </div>

        <aside className="profile-aside">
          <div className="profile-card-mini">
            <div className="mini-title">Atajos</div>
            <ul className="mini-list">
              <li><Link to="/formularios" className="mini-link">Mis Formularios</Link></li>
              <li><Link to="/comunicados" className="mini-link">Comunicados</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
