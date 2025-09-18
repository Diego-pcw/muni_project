// src/pages/UserHome.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserHome(): JSX.Element {
  const { user } = useAuth();

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>Bienvenido a la Municipalidad</h1>
      <p>
        {user ? `Hola ${user.name}. Puedes leer comunicados y registrar tu formulario.` : 'Consulta los comunicados o registra un formulario sin necesidad de iniciar sesión.'}
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
        <Link to="/comunicados" className="btn">Comunicados (Leer)</Link>
        <Link to="/formularios" className="btn">Formularios (Ver)</Link>
        <Link to="/formularios/create" className="btn">Registrar Formulario</Link>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <div style={{ display: 'flex', gap: 12 }}>
        {!user ? (
          <>
            <Link to="/login" className="btn">Iniciar sesión</Link>
            <Link to="/register" className="btn">Registrarse</Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn">Mi perfil</Link>
            <Link to="/" className="btn">Inicio</Link>
          </>
        )}
      </div>
    </div>
  );
}
