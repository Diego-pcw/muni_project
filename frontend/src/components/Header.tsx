// src/components/Header.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header(): JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">🏛️</div>
            <h2 className="brand-name">MUNICGAL</h2>
            <p className="brand-subtitle">Portal Ciudadano Digital</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <Link to="/" className="nav-item nav-item-primary" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Inicio</span>
          </Link>
          
          <Link to="/comunicados" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">📢</span>
            <span className="nav-text">Comunicados</span>
          </Link>
          
          <Link to="/formularios" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Mis Formularios</span>
          </Link>
          
          <Link to="/formularios/create" className="nav-item" onClick={() => setSidebarOpen(false)}>
            <span className="nav-icon">📝</span>
            <span className="nav-text">Nuevo Registro</span>
          </Link>

          <div className="nav-item" style={{ cursor: 'default', opacity: 0.6 }}>
            <span className="nav-icon">🤝</span>
            <span className="nav-text">Asistencia Técnica</span>
          </div>

          <div className="nav-item" style={{ cursor: 'default', opacity: 0.6 }}>
            <span className="nav-icon">🏪</span>
            <span className="nav-text">FERITAC</span>
          </div>

          {user?.rol === 'admin' && (
            <>
              <div style={{ 
                height: '1px', 
                background: '#e2e8f0', 
                margin: '16px 24px' 
              }}></div>
              <Link to="/admin/dashboard" className="nav-item" onClick={() => setSidebarOpen(false)}>
                <span className="nav-icon">⚙️</span>
                <span className="nav-text">Panel Admin</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Profile */}
        <div className="sidebar-footer">
          {user ? (
            <div className="user-profile-mini">
              <div className="avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-role">
                  {user.rol === 'admin' ? 'Administrador' : 'Ciudadano'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '12px', textAlign: 'center' }}>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', marginBottom: '8px' }}>
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ width: '100%' }}>
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
            display: window.innerWidth <= 1024 ? 'block' : 'none'
          }}
        />
      )}

      {/* Mobile Header */}
      <header 
        className="mobile-header"
        style={{
          display: window.innerWidth <= 1024 ? 'flex' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 95,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px'
          }}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1e293b',
            margin: 0
          }}>
            MUNICGAL
          </h3>
          <p style={{ 
            fontSize: '12px', 
            color: '#64748b',
            margin: 0
          }}>
            Portal Ciudadano
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user ? (
            <>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title="Cerrar Sesión"
              >
                🚪
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              style={{ 
                fontSize: '20px', 
                textDecoration: 'none',
                padding: '4px'
              }}
              title="Iniciar Sesión"
            >
              👤
            </Link>
          )}
        </div>
      </header>

      <style jsx>{`
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            position: fixed;
            z-index: 100;
          }
          
          .sidebar-open {
            transform: translateX(0);
          }
          
          .mobile-header {
            display: flex !important;
          }
        }

        @media (min-width: 1025px) {
          .mobile-header {
            display: none !important;
          }
          
          .sidebar {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}