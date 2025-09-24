// src/pages/Comunicados/ComunicadoDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { comunicadoService } from '../../services/comunicado.service';
import type { Comunicado } from '../../types';
import { useAuth } from '../../context/AuthContext';

export default function ComunicadoDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Comunicado | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    comunicadoService.show(Number(id))
      .then((res) => setItem(res.data as Comunicado))
      .catch((err: any) => {
        console.error(err);
        setError(err?.response?.data?.message || 'Error cargando comunicado');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!item) return <div style={{ padding: 20 }}>No encontrado</div>;

  const apiBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '');

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h2>{item.titulo}</h2>
      {item.imagen && (
        <div style={{ marginBottom: 12 }}>
          <img src={`${apiBase}/storage/${item.imagen}`} alt={item.titulo} style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'cover' }} />
        </div>
      )}
      <p><strong>Descripción:</strong></p>
      <div style={{ whiteSpace: 'pre-wrap', marginBottom: 12 }}>{item.descripcion}</div>

      <p>
        <strong>Fecha:</strong> {item.fecha_publicacion ? item.fecha_publicacion.slice(0,10) : '-'} &nbsp;
        <strong>Hora:</strong> {item.hora_publicacion ? item.hora_publicacion.slice(0,5) : '-'}
      </p>
      <p><strong>Publicador:</strong> {item.publicador} — <strong>Entidad:</strong> {item.entidad}</p>

      <div style={{ marginTop: 12 }}>
        <Link to="/comunicados" className="btn">Volver</Link>
        {/* Admin can edit from here (optional shortcut) */}
        {isAdmin && <Link to={`/comunicados/${item.id}/edit`} className="btn" style={{ marginLeft: 8 }}>Editar (admin)</Link>}
      </div>
    </div>
  );
}
