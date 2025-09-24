// src/pages/UserHome.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserHome(): JSX.Element {
  const { user } = useAuth();

  return (
    <div className="user-home-container">
      {/* Contenido Principal */}
      <div className="main-content">
        {/* Header Superior */}
        <div className="top-header">
          <div className="header-left">
            <h1 className="page-title">Portal Ciudadano</h1>
            <p className="page-subtitle">Municipalidad Distrital Coronel Gregorio Albarracín Lanchipa</p>
          </div>
          <div className="auth-buttons">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline">Iniciar Sesión</Link>
                <Link to="/register" className="btn btn-primary">Registrarse</Link>
              </>
            ) : (
              <div className="user-menu">
                <span style={{ color: '#64748b', fontSize: '14px' }}>
                  Bienvenido, <strong style={{ color: '#1e293b' }}>{user.name}</strong>
                </span>
                <Link to="/profile" className="btn btn-outline">Mi Perfil</Link>
              </div>
            )}
          </div>
        </div>

        {/* Área de Contenido */}
        <div className="content-area">
          {/* Sección de Bienvenida con imagen de fondo */}
          <div className="welcome-section">
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '40%',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 300\'%3E%3Crect width=\'400\' height=\'300\' fill=\'%23e0f2fe\'/%3E%3Cpath d=\'M200 50c-20 0-40 10-50 25v175c0 20 15 30 25 30h50c20 0 35-15 35-35V75c-10-15-30-25-60-25z\' fill=\'%23fff\' opacity=\'0.8\'/%3E%3Ccircle cx=\'200\' cy=\'80\' r=\'15\' fill=\'%23f59e0b\'/%3E%3Cpath d=\'M180 90h40v10h-40z\' fill=\'%230ea5e9\'/%3E%3C/svg%3E")',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              opacity: 0.1,
              borderRadius: '12px'
            }}></div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h1 className="welcome-title">
                🐔 Sistema Avícola Municipal
              </h1>
              <p className="welcome-description">
                PROYECTO DE MEJORAMIENTO DE LOS SERVICIOS DE APOYO AL DESARROLLO PRODUCTIVO EN LA CADENA PRODUCTIVA AVÍCOLA DEL DISTRITO DE CORONEL GREGORIO ALBARRACÍN
              </p>
            </div>
          </div>

          {/* Grid de Servicios */}
          <div className="cards-grid">
            <Link to="/comunicados" className="service-card">
              <span className="card-icon">📢</span>
              <h3 className="card-title">Comunicados Oficiales</h3>
              <p className="card-description">
                Mantente informado con las últimas noticias, anuncios y comunicados 
                oficiales de la municipalidad sobre el proyecto avícola.
              </p>
              <span className="card-action">Ver comunicados →</span>
            </Link>

            <Link to="/formularios/create" className="service-card service-card-featured">
              <div className="featured-badge">¡Importante!</div>
              <span className="card-icon">📝</span>
              <h3 className="card-title">Registro Avícola</h3>
              <p className="card-description">
                Registra tu emprendimiento avícola y accede a los beneficios del 
                programa de mejoramiento productivo del distrito.
              </p>
              <span className="card-action">Registrar ahora →</span>
            </Link>

            <Link to="/formularios" className="service-card">
              <span className="card-icon">📊</span>
              <h3 className="card-title">Consultar Formularios</h3>
              <p className="card-description">
                Revisa el estado de tus solicitudes y formularios enviados. 
                Accede al historial completo de tus trámites.
              </p>
              <span className="card-action">Ver formularios →</span>
            </Link>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="quick-stats">
            <h3 className="stats-title">📈 Impacto del Proyecto Avícola</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">150+</span>
                <span className="stat-label">Productores Beneficiados</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">25</span>
                <span className="stat-label">Módulos Productivos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">80%</span>
                <span className="stat-label">Incremento Productivo</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Capacitaciones Realizadas</span>
              </div>
            </div>
          </div>

          {/* Información del Proyecto */}
          <div className="welcome-section" style={{ marginTop: '32px' }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: '#1e293b', 
              marginBottom: '16px' 
            }}>
              🎯 Sobre el Proyecto
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#64748b', 
              lineHeight: '1.8',
              marginBottom: '20px' 
            }}>
              El <strong>Proyecto de Mejoramiento de los Servicios de Apoyo al Desarrollo Productivo 
              en la Cadena Productiva Avícola</strong> es una iniciativa que busca fortalecer la 
              competitividad de los pequeños y medianos productores avícolas del distrito mediante 
              asistencia técnica, mejora de infraestructura, y promoción comercial.
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '16px',
              marginTop: '24px' 
            }}>
              <div style={{ 
                background: '#f8fafc', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0' 
              }}>
                <h4 style={{ color: '#0ea5e9', marginBottom: '8px', fontSize: '16px' }}>
                  📚 Capacitación
                </h4>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                  Formación especializada en manejo, bioseguridad y nutrición animal
                </p>
              </div>
              <div style={{ 
                background: '#f8fafc', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0' 
              }}>
                <h4 style={{ color: '#f59e0b', marginBottom: '8px', fontSize: '16px' }}>
                  🏗️ Infraestructura
                </h4>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                  Módulos productivos, equipamiento tecnificado y sistemas eficientes
                </p>
              </div>
              <div style={{ 
                background: '#f8fafc', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #e2e8f0' 
              }}>
                <h4 style={{ color: '#0ea5e9', marginBottom: '8px', fontSize: '16px' }}>
                  🤝 Asociatividad
                </h4>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                  Fortalecimiento organizacional y acceso a mercados
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}