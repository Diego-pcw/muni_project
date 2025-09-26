// src/pages/Formularios/FormulariosList.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formularioService } from '../../services/formulario.service';
import type { Formulario, Paginated } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/formularios.shared.css';

export default function FormulariosList(): JSX.Element {
  const { user } = useAuth();
  const isAdmin = useMemo(() => user?.rol === 'admin', [user]);
  const { push } = useToast();

  const [items, setItems] = useState<Formulario[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [q, setQ] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); // controlled input
  const [error, setError] = useState<string | null>(null);

  // debounce searchTerm -> q (300ms)
  useEffect(() => {
    const t = setTimeout(() => setQ(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const load = async (p = 1, query = q) => {
    setLoading(true);
    setError(null);
    try {
      // cuando no es admin, pedimos solo "mine" (backend devolverá vacíos para invitados)
      const mine = Boolean(user && !isAdmin);
      const res = await formularioService.list(p, query, perPage, mine);
      const data = res.data as Paginated<Formulario>;
      setItems(data.data ?? []);
      setPage(data.current_page ?? p);
      setTotalPages(data.last_page ?? 1);
      setTotal(data.total ?? (data.data?.length ?? 0));
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || err?.message || 'Error cargando formularios';
      setError(msg);
      push(String(msg), 'error');
    } finally {
      setLoading(false);
    }
  };

  // when q or perPage or user changes, reload page 1
  useEffect(() => {
    setPage(1);
    load(1, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, perPage, user]);

  useEffect(() => {
    load(page, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Eliminar este formulario? Esta acción es irreversible.')) return;
    try {
      await formularioService.destroy(id);
      setItems((s) => s.filter((x) => x.id !== id));
      push('Formulario eliminado', 'success');
      setTotal(t => Math.max(0, t - 1));
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error al eliminar';
      push(String(msg), 'error');
    }
  };

  return (
    <div className="form-page list-page">
      <div className="form-card">
        <div className="form-card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="form-title">Formularios</h2>
              <p className="form-subtitle">Listado formal de solicitudes</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/formularios/create" className="btn btn-primary">Nuevo formulario</Link>
            </div>
          </div>
        </div>

        <div className="form-body">
          <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              className="form-input"
              placeholder="Buscar por nombre, DNI, celular o dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ minWidth: 260 }}
            />
            <select
              className="form-input"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              style={{ width: 120 }}
            >
              <option value={5}>5 / pág</option>
              <option value={10}>10 / pág</option>
              <option value={25}>25 / pág</option>
            </select>
            <button className="btn" onClick={() => { setSearchTerm(''); setQ(''); }}>Limpiar</button>
          </div>

          {loading ? (
            <div style={{ padding: 20, textAlign: 'center' }}>Cargando...</div>
          ) : error ? (
            <div style={{ padding: 20, color: 'red' }}>{error}</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="table form-list-table table-compact table-wide" aria-label="Listado de formularios">
                  <thead>
                    <tr>
                      <th>Nombres</th>
                      <th>DNI</th>
                      <th>RUC</th>
                      <th>Celular</th>
                      <th>Dirección</th>
                      <th>Asociación</th>
                      <th>Propiedad</th>
                      <th>Título</th>
                      <th>Registro público</th>
                      <th>Charlas</th>
                      <th>Adicional</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr><td colSpan={12} style={{ padding: 12 }}>No hay formularios</td></tr>
                    ) : (
                      items.map((f) => (
                        <tr key={f.id}>
                          <td>{f.nombres_apellidos}</td>
                          <td>{f.dni}</td>
                          <td>{f.ruc ?? '-'}</td>
                          <td>{f.celular}</td>
                          <td>{f.direccion}</td>
                          <td>{f.asociacion ?? '-'}</td>
                          <td>{f.propiedad ? 'Sí' : 'No'}</td>
                          <td>{f.titulo ? 'Sí' : 'No'}</td>
                          <td>{f.reg_publico ? 'Sí' : 'No'}</td>
                          <td>{f.charlas}</td>
                          <td>{f.adicional ?? '-'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {/* Ver siempre disponible (backend aplica autorización) */}
                              <Link to={`/formularios/${f.id}`} className="btn">Ver</Link>

                              {/* Edit: SOLO admin (clientes NO verán el botón) */}
                              {isAdmin && (
                                <Link to={`/formularios/${f.id}/edit`} className="btn">Editar</Link>
                              )}

                              {/* Delete: SOLO admin */}
                              {isAdmin && (
                                <button className="btn btn-danger" onClick={() => handleDelete(f.id)}>Eliminar</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* pagination */}
              <div className="pagination-row">
                <button className="btn" onClick={() => setPage((s) => Math.max(1, s - 1))} disabled={page <= 1}>Anterior</button>
                <span>Página {page} de {totalPages} — total: {total}</span>
                <button className="btn" onClick={() => setPage((s) => Math.min(totalPages, s + 1))} disabled={page >= totalPages}>Siguiente</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
