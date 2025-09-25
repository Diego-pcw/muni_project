// src/pages/Comunicados/ComunicadosList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { comunicadoService } from '../../services/comunicado.service';
import type { Comunicado, Paginated } from '../../types';
import { useAuth } from '../../context/AuthContext';
import '../../styles/comunicados.shared.css';

export default function ComunicadosList(): JSX.Element {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin';

  const [items, setItems] = useState<Comunicado[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (p = 1) => {
    setLoading(true);
    setError(null);
    try {
      const res = await comunicadoService.list(p);
      const data = res.data as Paginated<Comunicado>;
      setItems(data.data ?? []);
      setPage(data.current_page ?? p);
      setTotalPages(data.last_page ?? 1);
      setTotal(data.total ?? (data.data?.length ?? 0));
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Error cargando comunicados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Eliminar este comunicado?')) return;
    try {
      await comunicadoService.destroy(id);
      setItems((s) => s.filter((c) => c.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      alert('Comunicado eliminado (soft)');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error eliminando comunicado');
    }
  };

  return (
    <div className="comunicados-page">
      <div className="comunicados-card" role="region" aria-label="Listado de comunicados">
        <div className="card-header">
          <div>
            <h2 className="title">Comunicados</h2>
            <div className="subtitle">Listado público de comunicados</div>
          </div>

          <div>
            {isAdmin ? (
              <Link to="/comunicados/create" className="btn btn-primary">Nuevo comunicado</Link>
            ) : (
              <div style={{ width: 120 }} /> /* placeholder para alinear */
            )}
          </div>
        </div>

        <div className="comunicados-tools">
          {/* Mantuvimos funcionalidad pero con clases para estilizar */}
          {/* Search not present here (server side list uses pagination) - placeholder kept */}
        </div>

        {loading ? (
          <div style={{ padding: 18, textAlign: 'center' }}>Cargando...</div>
        ) : error ? (
          <div style={{ padding: 18, color: 'red' }}>{error}</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="comunicados-table table-dense" aria-label="Listado de comunicados">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Publicador</th>
                    <th>Entidad</th>
                    <th>Estado</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: 12 }}>No hay comunicados</td></tr>
                  ) : (
                    items.map((c) => (
                      <tr key={c.id}>
                        <td style={{ maxWidth: 300 }}>{c.titulo}</td>
                        <td>{c.fecha_publicacion ? c.fecha_publicacion.slice(0, 10) : '-'}</td>
                        <td>{c.hora_publicacion ? c.hora_publicacion.slice(0, 5) : '-'}</td>
                        <td style={{ maxWidth: 160 }}>{c.publicador}</td>
                        <td style={{ maxWidth: 160 }}>{c.entidad}</td>
                        <td>{c.estado}</td>
                        <td>
                          {c.imagen ? (
                            <span className="thumb" aria-hidden>
                              <img
                                src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '')}/storage/${c.imagen}`}
                                alt="mini"
                              />
                            </span>
                          ) : '-'}
                        </td>
                        <td>
                          <div className="actions">
                            <Link to={`/comunicados/${c.id}`} className="btn">Ver</Link>
                            {isAdmin && (
                              <>
                                <Link to={`/comunicados/${c.id}/edit`} className="btn">Editar</Link>
                                <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Eliminar</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-row" role="navigation" aria-label="Paginación comunicados">
              <button className="btn" onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page <= 1}>Anterior</button>
              <span>Página {page} de {totalPages} — total: {total}</span>
              <button className="btn" onClick={() => setPage((s) => Math.min(totalPages, s + 1))} disabled={page >= totalPages}>Siguiente</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

