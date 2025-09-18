// src/pages/Comunicados/ComunicadosList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { comunicadoService } from '../../services/comunicado.service';
import type { Comunicado, Paginated } from '../../types';

export default function ComunicadosList(): JSX.Element {
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
      // optimista: quitar de la lista
      setItems((s) => s.filter((c) => c.id !== id));
      setTotal((t) => Math.max(0, t - 1));
      alert('Comunicado eliminado (soft)');
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error eliminando comunicado');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Comunicados</h2>
        <Link to="/comunicados/create" className="btn btn-primary">Nuevo comunicado</Link>
      </div>

      {loading ? (
        <div className="card">Cargando...</div>
      ) : error ? (
        <div className="card" style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <div className="card">
            <table className="table" style={{ width: '100%' }}>
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
                      <td>{c.titulo}</td>
                      <td>{c.fecha_publicacion ? c.fecha_publicacion.slice(0,10) : '-'}</td>
                      <td>{c.hora_publicacion ? c.hora_publicacion.slice(0,5) : '-'}</td>
                      <td>{c.publicador}</td>
                      <td>{c.entidad}</td>
                      <td>{c.estado}</td>
                      <td>
                        {c.imagen ? (
                          <img src={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '')}/storage/${c.imagen}`} alt="mini" style={{ maxWidth: 80, maxHeight: 60, objectFit: 'cover' }} />
                        ) : '-'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link to={`/comunicados/${c.id}`} className="btn">Ver / Edit</Link>
                          <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn" onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page <= 1}>Anterior</button>
            <span>Página {page} de {totalPages} — total: {total}</span>
            <button className="btn" onClick={() => setPage((s) => Math.min(totalPages, s + 1))} disabled={page >= totalPages}>Siguiente</button>
          </div>
        </>
      )}
    </div>
  );
}
