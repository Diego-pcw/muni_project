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
    comunicadoService
      .show(Number(id))
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
      <article
        style={{
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          padding: 24,
        }}
      >
        {/* Título */}
        <h1
          style={{
            fontSize: '1.8rem',
            marginBottom: 16,
            color: '#222',
            lineHeight: 1.3,
          }}
        >
          {item.titulo}
        </h1>

        {/* Imagen */}
        {item.imagen && (
          <div style={{ marginBottom: 20, textAlign: 'center' }}>
            <img
              src={`${apiBase}/storage/${item.imagen}`}
              alt={item.titulo}
              style={{
                width: '100%',
                maxHeight: 420,
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
          </div>
        )}

        {/* Meta info */}
        <div
          style={{
            fontSize: '0.9rem',
            color: '#555',
            marginBottom: 16,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <span>
            <strong>📅 Fecha:</strong>{' '}
            {item.fecha_publicacion ? item.fecha_publicacion.slice(0, 10) : '-'}
          </span>
          <span>
            <strong>⏰ Hora:</strong>{' '}
            {item.hora_publicacion ? item.hora_publicacion.slice(0, 5) : '-'}
          </span>
          <span>
            <strong>✍️ Publicador:</strong> {item.publicador}
          </span>
          <span>
            <strong>🏢 Entidad:</strong> {item.entidad}
          </span>
        </div>

        {/* Descripción */}
        <section style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 8, color: '#333' }}>Descripción</h3>
          <div
            style={{
              whiteSpace: 'pre-wrap',      // respeta saltos manuales
              wordBreak: 'break-word',     // corta palabras largas si exceden el ancho
              overflowWrap: 'anywhere',    // alternativa moderna para asegurar quiebre
              lineHeight: 1.6,
              color: '#444',
              background: '#fafafa',
              padding: 16,
              borderRadius: 8,
              border: '1px solid #eee',
            }}
          >
            {item.descripcion}
          </div>
        </section>

        {/* Acciones */}
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <Link to="/comunicados" className="btn">
            ← Volver
          </Link>
          {isAdmin && (
            <Link
              to={`/comunicados/${item.id}/edit`}
              className="btn btn-primary"
            >
              ✏️ Editar
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
