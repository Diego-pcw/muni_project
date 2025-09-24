// src/components/Layout.tsx
import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="app-layout">
      <Header />
      
      <main 
        className="main-layout"
        style={{
          marginLeft: window.innerWidth > 1024 ? '280px' : '0',
          marginTop: window.innerWidth <= 1024 ? '64px' : '0',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ flex: 1 }}>
          <Outlet />
          {children}
        </div>
        
        {/* Footer */}
        <footer 
          style={{
            background: '#1e293b',
            color: '#e2e8f0',
            padding: '48px 32px 24px',
            marginTop: 'auto'
          }}
        >
          <div 
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px'
            }}
          >
            {/* Columna 1: Información Municipal */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '32px' }}>🏛️</span>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0' }}>MUNICGAL</h3>
                  <p style={{ fontSize: '12px', opacity: '0.8', margin: '0' }}>Portal Digital</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: '0.9' }}>
                Municipalidad Distrital de Coronel Gregorio Albarracín Lanchipa.
                Comprometidos con el desarrollo sostenible y el bienestar de nuestros ciudadanos.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <div style={{ 
                  background: '#334155',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  📍 Tacna, Perú
                </div>
                <div style={{ 
                  background: '#334155',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  📞 054-123456
                </div>
              </div>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#f59e0b'
              }}>
                🔗 Enlaces Rápidos
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href="/" style={{ 
                  color: '#cbd5e1', 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}>
                  🏠 Inicio
                </a>
                <a href="/comunicados" style={{ 
                  color: '#cbd5e1', 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}>
                  📢 Comunicados
                </a>
                <a href="/formularios" style={{ 
                  color: '#cbd5e1', 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}>
                  📊 Formularios
                </a>
                <a href="/formularios/create" style={{ 
                  color: '#cbd5e1', 
                  textDecoration: 'none', 
                  fontSize: '14px',
                  transition: 'color 0.2s ease'
                }}>
                  📝 Registro Avícola
                </a>
              </div>
            </div>

            {/* Columna 3: Proyecto Avícola */}
            <div>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '16px',
                color: '#0ea5e9'
              }}>
                🐔 Proyecto Avícola
              </h4>
              <p style={{ 
                fontSize: '13px', 
                lineHeight: '1.5', 
                opacity: '0.9',
                marginBottom: '12px'
              }}>
                Mejoramiento de los Servicios de Apoyo al Desarrollo Productivo 
                en la Cadena Productiva Avícola del distrito.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ fontSize: '12px', opacity: '0.8' }}>
                  ✅ 150+ Productores beneficiados
                </div>
                <div style={{ fontSize: '12px', opacity: '0.8' }}>
                  ✅ 25 Módulos productivos
                </div>
                <div style={{ fontSize: '12px', opacity: '0.8' }}>
                  ✅ Capacitación especializada
                </div>
                <div style={{ fontSize: '12px', opacity: '0.8' }}>
                  ✅ Mejora genética y reproductiva
                </div>
              </div>
            </div>
          </div>

          {/* Línea separadora */}
          <div style={{ 
            height: '1px', 
            background: '#475569', 
            margin: '32px 0 24px',
            maxWidth: '1200px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}></div>

          {/* Footer Bottom */}
          <div style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ fontSize: '12px', opacity: '0.7' }}>
              © 2025 Municipalidad Distrital de Coronel Gregorio Albarracín Lanchipa. 
              Todos los derechos reservados.
            </div>
            
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                📋 Términos de Uso
              </a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                🔒 Política de Privacidad
              </a>
              <a href="#" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                📞 Contacto
              </a>
            </div>
          </div>
        </footer>
      </main>

      <style jsx>{`
        @media (max-width: 768px) {
          footer > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          footer > div:last-child {
            flex-direction: column !important;
            text-align: center !important;
            gap: 12px !important;
          }
        }

        footer a:hover {
          color: #f59e0b !important;
        }
      `}</style>
    </div>
  );
}