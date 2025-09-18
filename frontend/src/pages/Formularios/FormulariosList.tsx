// src/pages/Formularios/FormulariosList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formularioService } from '../../services/formulario.service';
import type { Formulario, Paginated } from '../../types';

export default function FormulariosList(): JSX.Element {
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
      const res = await formularioService.list(p, query, perPage);
      const data = res.data as Paginated<Formulario>;
      setItems(data.data ?? []);
      setPage(data.current_page ?? p);
      setTotalPages(data.last_page ?? 1);
      setTotal(data.total ?? (data.data?.length ?? 0));
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Error cargando formularios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1, q); // reset to first page on new query
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, perPage]);

  useEffect(() => {
    load(page, q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!confirm('¿Eliminar este formulario? Esta acción es irreversible.')) return;
    try {
      await formularioService.destroy(id);
      // remove locally (without re-request)
      setItems((s) => s.filter((x) => x.id !== id));
      alert('Formulario eliminado');
      // adjust total if present
      setTotal(t => Math.max(0, t - 1));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error al eliminar');
    }
  };

  const startCreate = () => {
    // go to create page
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Formularios</h2>
        <Link to="/formularios/create" className="btn btn-primary">Nuevo formulario</Link>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <input
          placeholder="Buscar por nombre, DNI, celular o dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: 8, minWidth: 260 }}
        />
        <select value={perPage} onChange={(e) => setPerPage(Number(e.target.value))}>
          <option value={5}>5 / pág</option>
          <option value={10}>10 / pág</option>
          <option value={25}>25 / pág</option>
        </select>
        <button className="btn" onClick={() => { setSearchTerm(''); setQ(''); }}>Limpiar</button>
      </div>

      {loading ? (
        <div className="card">Cargando...</div>
      ) : error ? (
        <div className="card" style={{ color: 'red' }}>{error}</div>
      ) : (
        <>
          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="table">
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={10} style={{ padding: 12 }}>No hay formularios</td></tr>
                ) : (
                  items.map((f) => (
                    <tr key={f.id}>
                      <td>{f.nombres_apellidos}</td>
                      <td>{f.dni}</td>
                      <td>{f.ruc}</td>
                      <td>{f.celular}</td>
                      <td>{f.direccion}</td>
                      <td>{f.asociacion ?? '-'}</td>
                      <td>{f.propiedad ? 'Sí' : 'No'}</td>
                      <td>{f.titulo ? 'Sí' : 'No'}</td>
                      <td>{f.reg_publico ? 'Sí' : 'No'}</td>
                      <td>{f.charlas}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Link to={`/formularios/${f.id}`} className="btn">Ver / Edit</Link>
                          <button className="btn btn-danger" onClick={() => handleDelete(f.id)}>Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
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
